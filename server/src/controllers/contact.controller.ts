import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone must be at least 5 characters").optional().or(z.literal("")),
  favorite: z.boolean().optional(),
});

export const getContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { search, favorite, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ];
    }

    if (favorite === "true") {
      where.favorite = true;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: "asc" },
      }),
      prisma.contact.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      contacts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = parseInt(req.params.id as string);

    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = contactSchema.parse(req.body);

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        favorite: data.favorite || false,
        userId,
      },
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: (error as any).errors[0].message });
      return;
    }
    next(error);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = parseInt(req.params.id as string);
    const data = contactSchema.parse(req.body);

    const existing = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        favorite: data.favorite ?? existing.favorite,
      },
    });

    res.status(200).json({ success: true, contact });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: (error as any).errors[0].message });
      return;
    }
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = parseInt(req.params.id as string);

    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    await prisma.contact.delete({ where: { id: contactId } });

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = parseInt(req.params.id as string);

    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    const updated = await prisma.contact.update({
      where: { id: contactId },
      data: { favorite: !contact.favorite },
    });

    res.status(200).json({ success: true, contact: updated });
  } catch (error) {
    next(error);
  }
};
