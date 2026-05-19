import { WasteEvent } from "../../shared/types/mrv";

export class SearchService {
  // Simulator for OpenSearch / ElasticSearch
  // In production, this would use the OpenSearch client to index and search.

  private static index: any[] = [];

  static async indexEvent(event: WasteEvent) {
    this.index.push({
        id: event.id,
        type: event.type,
        village: (event as any).village,
        district: event.governance?.municipal_sign_off?.ward_id,
        weight: event.weight,
        timestamp: event.timestamp,
        status: event.status
    });
    console.log(`[SEARCH] Indexed event ${event.id}`);
  }

  static async search(query: string) {
    // Fuzzy search heuristic
    const q = query.toLowerCase();
    return this.index.filter(item => 
        item.village?.toLowerCase().includes(q) || 
        item.type.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q)
    );
  }
}
