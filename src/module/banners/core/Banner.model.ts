import type { Consulta } from "@/src/lib/db";
import type { Banner } from "@/src/types/domain";
import repository from "./Banner.repository";
import { BannersMapper } from "./Banner.mapper";
import { BANNERS_SEED } from "./Banner.seed";

export class BannerModel {
  async getBanners(): Promise<Banner[]> {
    return BannersMapper(await repository.getBanners());
  }

  // Lo que muestra la portada: solo los visibles, por posición.
  async getVisibleBanners(): Promise<Banner[]> {
    return BannersMapper(await repository.getVisibleBanners());
  }

  // «Restaurar demo»: deja los banners como en la semilla.
  async restoreSeed(consulta: Consulta): Promise<void> {
    await repository.restoreSeed(BANNERS_SEED, consulta);
  }
}

const bannerModel = new BannerModel();
export default bannerModel;
