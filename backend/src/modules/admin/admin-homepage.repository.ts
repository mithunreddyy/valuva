import { prisma } from "../../config/database";

export class AdminHomepageRepository {
  async getAllSections() {
    return prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async getSectionById(id: string) {
    return prisma.homepageSection.findUnique({
      where: { id },
    });
  }

  async createSection(data: any) {
    return prisma.homepageSection.create({
      data,
    });
  }

  async updateSection(id: string, data: any) {
    return prisma.homepageSection.update({
      where: { id },
      data,
    });
  }

  async deleteSection(id: string) {
    await prisma.homepageSection.delete({
      where: { id },
    });
  }

  async reorderSections(sections: Array<{ id: string; sortOrder: number }>) {
    const updates = sections.map((section) =>
      prisma.homepageSection.update({
        where: { id: section.id },
        data: { sortOrder: section.sortOrder },
      })
    );

    return prisma.$transaction(updates);
  }
}
