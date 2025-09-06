import type { PageInfo } from "../../../shared/types/page";
import type { MemberInfo, MemberType } from "../../user/types/user";

type Tier =
  | "DIAMOND_STAR_1"
  | "DIAMOND_STAR_2"
  | "DIAMOND_STAR_3"
  | "DIAMOND_STAR_4"
  | "DIAMOND_STAR_5"
  | "GOLD_STAR_1"
  | "GOLD_STAR_2"
  | "GOLD_STAR_3"
  | "GOLD_STAR_4"
  | "GOLD_STAR_5"
  | "SILVER_STAR_1"
  | "SILVER_STAR_2"
  | "SILVER_STAR_3"
  | "SILVER_STAR_4"
  | "SILVER_STAR_5"
  | "BRONZE_STAR_1"
  | "BRONZE_STAR_2"
  | "BRONZE_STAR_3"
  | "BRONZE_STAR_4"
  | "BRONZE_STAR_5"
  | "GOLD_MEDAL_1"
  | "GOLD_MEDAL_2"
  | "GOLD_MEDAL_3"
  | "GOLD_MEDAL_4"
  | "GOLD_MEDAL_5"
  | "SILVER_MEDAL_1"
  | "SILVER_MEDAL_2"
  | "SILVER_MEDAL_3"
  | "SILVER_MEDAL_4"
  | "SILVER_MEDAL_5"
  | "COPPER_MEDAL_1"
  | "COPPER_MEDAL_2"
  | "COPPER_MEDAL_3"
  | "COPPER_MEDAL_4"
  | "COPPER_MEDAL_5"
  | "NOOBIE_1"
  | "NOOBIE_2"
  | "NOOBIE_3"
  | "NOOBIE_4"
  | "NOOBIE_5"
  | "NONE";

export type UserRankInfo = {
  rank: number;
  tier: Tier;
  score: number;
  totalUserCount: number;
};

export type RankInfo = {
  memberInfo: MemberInfo;
  rank: number;
  tier: Tier;
  score: number;
  totalSubmittedCount: number;
  successCount: number;
};

export interface RankInfoPagination extends PageInfo {
  queryResults: RankInfo[];
}
