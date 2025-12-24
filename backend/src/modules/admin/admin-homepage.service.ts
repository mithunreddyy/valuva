import { NotFoundError } from "../../utils/error.util";
import { AdminHomepageRepository } from "./admin-homepage.repository";

export class AdminHomepageService {
  private repository: AdminHomepageRepository;

  constructor() {
    this.repository = new AdminHomepageRepository();
  }

  async getAllSections() {
    return this.repository.getAllSections();
  }

  async getSectionById(id: string) {
    const section = await this.repository.getSectionById(id);
    if (!section) {
      throw new NotFoundError("Section not found");
    }
    return section;
  }

  async createSection(data: any) {
    return this.repository.createSection({
      ...data,
      isActive: true,
    });
  }

  async updateSection(id: string, data: any) {
    const section = await this.repository.getSectionById(id);
    if (!section) {
      throw new NotFoundError("Section not found");
    }

    return this.repository.updateSection(id, data);
  }

  async deleteSection(id: string) {
    const section = await this.repository.getSectionById(id);
    if (!section) {
      throw new NotFoundError("Section not found");
    }

    await this.repository.deleteSection(id);
  }

  async reorderSections(sections: Array<{ id: string; sortOrder: number }>) {
    return this.repository.reorderSections(sections);
  }
}
