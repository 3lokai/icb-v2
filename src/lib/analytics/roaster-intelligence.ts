// src/lib/analytics/roaster-intelligence.ts
// Business intelligence engine for roaster partnership analytics

import { trackEnhancedEvent } from "./enhanced-tracking";

// Interface for industry benchmarks
interface IndustryBenchmarks {
  avg_profile_views: number;
  avg_engagement_rate: number;
  avg_external_click_rate: number;
  avg_partnership_value: number;
}

// Interface for raw analytics data structure
interface RawAnalyticsData {
  profileViews?: number;
  uniqueUsers?: number;
  avgSessionDuration?: number;
  pagesPerSession?: number;
  bounceRate?: number;
  coffeeViews?: number;
  ratingsReceived?: number;
  socialClicks?: number;
  websiteClicks?: number;
  contactInquiries?: number;
  highQualitySessions?: number;
  engagementRate?: number;
  returnVisitorRate?: number;
  avgTimeOnPages?: number;
  externalClickRate?: number;
  topCities?: CityData[];
  trafficSources?: {
    organic_search?: { sessions: number; quality_score: number };
    social_media?: { sessions: number; quality_score: number };
    direct?: { sessions: number; quality_score: number };
    referral?: { sessions: number; quality_score: number };
  };
  contentAttribution?: Array<{
    article_title: string;
    coffee_clicks_generated: number;
    roaster_visits_generated: number;
    estimated_value: number;
  }>;
  performanceTrends?: {
    last_7_days: number[];
    last_30_days: number[];
    growth_rate: number;
  };
}

// Interface for city data within metrics
interface CityData {
  city: string;
  visits: number;
  percentage: number;
  avg_session_quality: number;
}

// Roaster Performance Metrics (REAL data structure)
export interface RoasterPerformanceMetrics {
  // Traffic Metrics
  total_profile_views: number;
  unique_visitors: number;
  average_session_duration: number;
  pages_per_session: number;
  bounce_rate: number;

  // Engagement Metrics
  coffee_detail_views: number;
  coffee_ratings_received: number;
  social_media_clicks: number;
  website_clicks: number;
  contact_inquiries: number;

  // Quality Metrics
  high_quality_sessions: number; // Session quality >= 4
  engagement_rate: number; // % sessions with interactions
  return_visitor_rate: number;
  average_time_on_roaster_pages: number;

  // Conversion Metrics
  external_click_rate: number; // % visitors who clicked external links
  estimated_monthly_value: number; // Based on realistic calculations
  partnership_potential_score: number; // 1-10 scale

  // Geographic Data
  top_cities: Array<{
    city: string;
    visits: number;
    percentage: number;
    avg_session_quality: number;
  }>;

  // Traffic Sources
  traffic_sources: {
    organic_search: { sessions: number; quality_score: number };
    social_media: { sessions: number; quality_score: number };
    direct: { sessions: number; quality_score: number };
    referral: { sessions: number; quality_score: number };
  };

  // Content Attribution
  content_attribution: Array<{
    article_title: string;
    coffee_clicks_generated: number;
    roaster_visits_generated: number;
    estimated_value: number;
  }>;

  // Time-based Trends
  performance_trends: {
    last_7_days: number[];
    last_30_days: number[];
    growth_rate: number; // % change vs previous period
  };
}

// Partnership Value Calculator (REALISTIC estimates)
export class PartnershipValueCalculator {
  // Industry-standard directory referral values
  private static readonly BASE_CLICK_VALUE = 1.5;
  private static readonly HIGH_QUALITY_MULTIPLIER = 2.0;
  private static readonly ENGAGEMENT_MULTIPLIER = 1.5;
  private static readonly GEOGRAPHIC_PREMIUM = 0.25; // Metro cities

  static calculateMonthlyValue(metrics: RoasterPerformanceMetrics): number {
    const {
      website_clicks,
      high_quality_sessions,
      total_profile_views,
      engagement_rate,
    } = metrics;

    // Base value calculation
    let monthlyValue =
      website_clicks * PartnershipValueCalculator.BASE_CLICK_VALUE;

    // Quality multipliers
    const qualityRatio = high_quality_sessions / total_profile_views;
    if (qualityRatio > 0.3) {
      monthlyValue *= PartnershipValueCalculator.HIGH_QUALITY_MULTIPLIER;
    }

    // Engagement bonus
    if (engagement_rate > 0.4) {
      monthlyValue *= PartnershipValueCalculator.ENGAGEMENT_MULTIPLIER;
    }

    // Geographic premium for metro traffic
    const metroTraffic = metrics.top_cities
      .filter((city) => PartnershipValueCalculator.isMetroCity(city.city))
      .reduce((sum, city) => sum + city.visits, 0);

    const metroRatio = metroTraffic / total_profile_views;
    monthlyValue +=
      monthlyValue * metroRatio * PartnershipValueCalculator.GEOGRAPHIC_PREMIUM;

    return Math.round(monthlyValue * 100) / 100;
  }

  static calculatePartnershipPotential(
    metrics: RoasterPerformanceMetrics
  ): number {
    const {
      engagement_rate,
      return_visitor_rate,
      external_click_rate,
      average_session_duration,
    } = metrics;

    let score = 5; // Base score

    // Engagement factors
    if (engagement_rate > 0.5) score += 2;
    else if (engagement_rate > 0.3) score += 1;

    // Loyalty factors
    if (return_visitor_rate > 0.3) score += 1.5;
    if (average_session_duration > 180) score += 1;

    // Conversion factors
    if (external_click_rate > 0.15) score += 1.5;
    else if (external_click_rate > 0.1) score += 1;

    return Math.min(Math.round(score * 10) / 10, 10);
  }

  private static isMetroCity(city: string): boolean {
    const metros = [
      "mumbai",
      "delhi",
      "bangalore",
      "hyderabad",
      "chennai",
      "kolkata",
      "pune",
    ];
    return metros.some((metro) => city.toLowerCase().includes(metro));
  }
}

// Roaster Performance Analyzer
export class RoasterPerformanceAnalyzer {
  // Generate comprehensive roaster report
  static async generateRoasterReport(
    roasterId: string,
    timeframe: "week" | "month" | "quarter" = "month"
  ): Promise<RoasterPerformanceMetrics> {
    // Track that a report was generated
    trackEnhancedEvent({
      event_name: "roaster_report_generated",
      event_category: "performance",
      roaster_id: roasterId,
      custom_parameters: {
        timeframe,
        report_type: "business_intelligence",
        generated_by: "admin_panel",
      },
    });

    try {
      // This would integrate with your actual analytics API
      // For now, return structure you'll populate with real GA4 data
      const response = await fetch("/api/analytics/roaster-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roasterId, timeframe }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roaster analytics");
      }

      const rawData = await response.json();
      return RoasterPerformanceAnalyzer.processRawAnalytics(rawData);
    } catch (error) {
      console.error("Error generating roaster report:", error);

      // Return placeholder structure for development
      return RoasterPerformanceAnalyzer.getPlaceholderMetrics();
    }
  }

  // Process raw GA4 data into business intelligence
  private static processRawAnalytics(
    rawData: RawAnalyticsData
  ): RoasterPerformanceMetrics {
    // Transform GA4 API response into business metrics
    const metrics: RoasterPerformanceMetrics = {
      total_profile_views: rawData.profileViews || 0,
      unique_visitors: rawData.uniqueUsers || 0,
      average_session_duration: rawData.avgSessionDuration || 0,
      pages_per_session: rawData.pagesPerSession || 0,
      bounce_rate: rawData.bounceRate || 0,

      coffee_detail_views: rawData.coffeeViews || 0,
      coffee_ratings_received: rawData.ratingsReceived || 0,
      social_media_clicks: rawData.socialClicks || 0,
      website_clicks: rawData.websiteClicks || 0,
      contact_inquiries: rawData.contactInquiries || 0,

      high_quality_sessions: rawData.highQualitySessions || 0,
      engagement_rate: rawData.engagementRate || 0,
      return_visitor_rate: rawData.returnVisitorRate || 0,
      average_time_on_roaster_pages: rawData.avgTimeOnPages || 0,

      external_click_rate: rawData.externalClickRate || 0,
      estimated_monthly_value: 0, // Calculated below
      partnership_potential_score: 0, // Calculated below

      top_cities: rawData.topCities || [],
      traffic_sources: {
        organic_search: rawData.trafficSources?.organic_search || {
          sessions: 0,
          quality_score: 0,
        },
        social_media: rawData.trafficSources?.social_media || {
          sessions: 0,
          quality_score: 0,
        },
        direct: rawData.trafficSources?.direct || {
          sessions: 0,
          quality_score: 0,
        },
        referral: rawData.trafficSources?.referral || {
          sessions: 0,
          quality_score: 0,
        },
      },

      content_attribution: rawData.contentAttribution || [],
      performance_trends: rawData.performanceTrends || {
        last_7_days: [],
        last_30_days: [],
        growth_rate: 0,
      },
    };

    // Calculate derived metrics
    metrics.estimated_monthly_value =
      PartnershipValueCalculator.calculateMonthlyValue(metrics);
    metrics.partnership_potential_score =
      PartnershipValueCalculator.calculatePartnershipPotential(metrics);

    return metrics;
  }

  // Compare roaster performance against benchmarks
  static async generateBenchmarkComparison(roasterId: string): Promise<{
    roaster_metrics: RoasterPerformanceMetrics;
    industry_benchmarks: {
      avg_profile_views: number;
      avg_engagement_rate: number;
      avg_external_click_rate: number;
      avg_partnership_value: number;
    };
    performance_ranking: {
      percentile: number;
      rank_description: "top_10" | "top_25" | "top_50" | "below_average";
    };
  }> {
    const roasterMetrics =
      await RoasterPerformanceAnalyzer.generateRoasterReport(roasterId);

    // Calculate industry benchmarks (you'll populate with real data)
    const benchmarks =
      await RoasterPerformanceAnalyzer.calculateIndustryBenchmarks();

    // Calculate performance ranking
    const ranking = RoasterPerformanceAnalyzer.calculatePerformanceRanking(
      roasterMetrics,
      benchmarks
    );

    trackEnhancedEvent({
      event_name: "roaster_benchmark_comparison",
      event_category: "performance",
      roaster_id: roasterId,
      custom_parameters: {
        percentile: ranking.percentile,
        performance_tier: ranking.rank_description,
      },
    });

    return {
      roaster_metrics: roasterMetrics,
      industry_benchmarks: benchmarks,
      performance_ranking: ranking,
    };
  }

  // Calculate industry benchmarks from all roasters
  private static async calculateIndustryBenchmarks() {
    // This would query aggregate data from all roasters
    return {
      avg_profile_views: 150,
      avg_engagement_rate: 0.25,
      avg_external_click_rate: 0.08,
      avg_partnership_value: 45.0,
    };
  }

  // Calculate where roaster ranks vs others
  private static calculatePerformanceRanking(
    metrics: RoasterPerformanceMetrics,
    benchmarks: IndustryBenchmarks
  ) {
    // Score roaster against benchmarks
    let score = 0;

    if (metrics.total_profile_views > benchmarks.avg_profile_views * 2)
      score += 25;
    else if (metrics.total_profile_views > benchmarks.avg_profile_views)
      score += 15;

    if (metrics.engagement_rate > benchmarks.avg_engagement_rate * 1.5)
      score += 25;
    else if (metrics.engagement_rate > benchmarks.avg_engagement_rate)
      score += 15;

    if (metrics.external_click_rate > benchmarks.avg_external_click_rate * 1.5)
      score += 25;
    else if (metrics.external_click_rate > benchmarks.avg_external_click_rate)
      score += 15;

    if (
      metrics.estimated_monthly_value >
      benchmarks.avg_partnership_value * 1.5
    )
      score += 25;
    else if (metrics.estimated_monthly_value > benchmarks.avg_partnership_value)
      score += 15;

    const percentile = Math.min(score, 100);

    let rank_description: "top_10" | "top_25" | "top_50" | "below_average";
    if (percentile >= 90) rank_description = "top_10";
    else if (percentile >= 75) rank_description = "top_25";
    else if (percentile >= 50) rank_description = "top_50";
    else rank_description = "below_average";

    return { percentile, rank_description };
  }

  // Get placeholder data for development
  private static getPlaceholderMetrics(): RoasterPerformanceMetrics {
    return {
      total_profile_views: 0,
      unique_visitors: 0,
      average_session_duration: 0,
      pages_per_session: 0,
      bounce_rate: 0,
      coffee_detail_views: 0,
      coffee_ratings_received: 0,
      social_media_clicks: 0,
      website_clicks: 0,
      contact_inquiries: 0,
      high_quality_sessions: 0,
      engagement_rate: 0,
      return_visitor_rate: 0,
      average_time_on_roaster_pages: 0,
      external_click_rate: 0,
      estimated_monthly_value: 0,
      partnership_potential_score: 0,
      top_cities: [],
      traffic_sources: {
        organic_search: { sessions: 0, quality_score: 0 },
        social_media: { sessions: 0, quality_score: 0 },
        direct: { sessions: 0, quality_score: 0 },
        referral: { sessions: 0, quality_score: 0 },
      },
      content_attribution: [],
      performance_trends: {
        last_7_days: [],
        last_30_days: [],
        growth_rate: 0,
      },
    };
  }
}

// Partnership Pitch Generator
export class PartnershipPitchGenerator {
  private static calculateMetroPercentage(cities: CityData[]): number {
    const metros = [
      "mumbai",
      "delhi",
      "bangalore",
      "hyderabad",
      "chennai",
      "kolkata",
      "pune",
    ];
    const metroVisits = cities
      .filter((city) =>
        metros.some((metro) => city.city.toLowerCase().includes(metro))
      )
      .reduce((sum, city) => sum + city.visits, 0);

    const totalVisits = cities.reduce((sum, city) => sum + city.visits, 0);
    return totalVisits > 0 ? Math.round((metroVisits / totalVisits) * 100) : 0;
  }

  private static identifyExpansionOpportunities(cities: CityData[]): string[] {
    const tier2Cities = ["coimbatore", "kochi", "mysore", "madurai"];
    const presentCities = cities.map((c) => c.city.toLowerCase());

    return tier2Cities
      .filter(
        (city) => !presentCities.some((present) => present.includes(city))
      )
      .slice(0, 3);
  }

  private static identifyKeyAdvantages(
    metrics: RoasterPerformanceMetrics,
    benchmarks: IndustryBenchmarks
  ): string[] {
    const advantages = [];

    if (metrics.engagement_rate > benchmarks.avg_engagement_rate * 1.2) {
      advantages.push("Above-average user engagement");
    }
    if (
      metrics.external_click_rate >
      benchmarks.avg_external_click_rate * 1.1
    ) {
      advantages.push("High conversion rate to external sites");
    }
    if (metrics.return_visitor_rate > 0.3) {
      advantages.push("Strong brand loyalty indicators");
    }

    return advantages.slice(0, 3);
  }

  private static identifyImprovementAreas(
    metrics: RoasterPerformanceMetrics,
    benchmarks: IndustryBenchmarks
  ): string[] {
    const areas = [];

    if (metrics.total_profile_views < benchmarks.avg_profile_views * 0.8) {
      areas.push("Increase brand visibility and discovery");
    }
    if (metrics.engagement_rate < benchmarks.avg_engagement_rate * 0.8) {
      areas.push("Improve content engagement strategies");
    }
    if (
      metrics.external_click_rate <
      benchmarks.avg_external_click_rate * 0.8
    ) {
      areas.push("Optimize conversion funnel and calls-to-action");
    }

    return areas.slice(0, 2);
  }

  // Generate partnership pitch data for roasters
  static async generatePitchReport(roasterId: string): Promise<{
    summary: {
      monthly_visitors: number;
      estimated_monthly_value: string;
      quality_score: string;
      growth_trend: string;
    };
    traffic_breakdown: {
      source: string;
      visitors: number;
      quality: "high" | "medium" | "low";
      conversion_rate: string;
    }[];
    geographic_insights: {
      top_markets: string[];
      metro_percentage: string;
      expansion_opportunities: string[];
    };
    competitive_positioning: {
      market_rank: string;
      key_advantages: string[];
      improvement_areas: string[];
    };
    partnership_benefits: {
      estimated_revenue_impact: string;
      lead_generation_potential: string;
      brand_exposure_value: string;
    };
  }> {
    const metrics =
      await RoasterPerformanceAnalyzer.generateRoasterReport(roasterId);
    const benchmark =
      await RoasterPerformanceAnalyzer.generateBenchmarkComparison(roasterId);

    trackEnhancedEvent({
      event_name: "partnership_pitch_generated",
      event_category: "conversion",
      roaster_id: roasterId,
      conversion_value: metrics.estimated_monthly_value,
      custom_parameters: {
        pitch_type: "roaster_partnership",
        partnership_potential: metrics.partnership_potential_score,
      },
    });

    return {
      summary: {
        monthly_visitors: metrics.unique_visitors,
        estimated_monthly_value: `₹${metrics.estimated_monthly_value.toFixed(2)}`,
        quality_score: `${metrics.partnership_potential_score}/10`,
        growth_trend: `${benchmark.performance_ranking.percentile}th percentile`,
      },

      traffic_breakdown: [
        {
          source: "Organic Search",
          visitors: metrics.traffic_sources.organic_search.sessions,
          quality:
            metrics.traffic_sources.organic_search.quality_score > 3
              ? "high"
              : "medium",
          conversion_rate: `${(metrics.external_click_rate * 100).toFixed(1)}%`,
        },
        {
          source: "Social Media",
          visitors: metrics.traffic_sources.social_media.sessions,
          quality:
            metrics.traffic_sources.social_media.quality_score > 3
              ? "high"
              : "medium",
          conversion_rate: `${(metrics.external_click_rate * 100).toFixed(1)}%`,
        },
      ],

      geographic_insights: {
        top_markets: metrics.top_cities.slice(0, 5).map((city) => city.city),
        metro_percentage: `${PartnershipPitchGenerator.calculateMetroPercentage(metrics.top_cities)}%`,
        expansion_opportunities:
          PartnershipPitchGenerator.identifyExpansionOpportunities(
            metrics.top_cities
          ),
      },

      competitive_positioning: {
        market_rank: benchmark.performance_ranking.rank_description.replace(
          "_",
          " "
        ),
        key_advantages: PartnershipPitchGenerator.identifyKeyAdvantages(
          metrics,
          benchmark.industry_benchmarks
        ),
        improvement_areas: PartnershipPitchGenerator.identifyImprovementAreas(
          metrics,
          benchmark.industry_benchmarks
        ),
      },

      partnership_benefits: {
        estimated_revenue_impact: `₹${(metrics.estimated_monthly_value * 12).toFixed(2)} annually`,
        lead_generation_potential: `${metrics.contact_inquiries} monthly inquiries`,
        brand_exposure_value: `${metrics.total_profile_views} monthly brand impressions`,
      },
    };
  }
}

// Export all roaster data for partnership discussions
export async function exportRoasterPartnershipsReport(): Promise<{
  total_roasters: number;
  platform_metrics: {
    total_monthly_visitors: number;
    total_roaster_clicks: number;
    average_partnership_value: number;
    top_performing_roasters: Array<{
      roaster_id: string;
      name: string;
      monthly_value: number;
      partnership_score: number;
    }>;
  };
  growth_insights: {
    month_over_month_growth: number;
    trending_regions: string[];
    emerging_roasters: string[];
  };
}> {
  trackEnhancedEvent({
    event_name: "platform_partnerships_report_exported",
    event_category: "performance",
    custom_parameters: {
      report_type: "platform_overview",
      export_format: "json",
    },
  });

  // This would aggregate data from all roasters
  // Return placeholder structure for now
  return {
    total_roasters: 0,
    platform_metrics: {
      total_monthly_visitors: 0,
      total_roaster_clicks: 0,
      average_partnership_value: 0,
      top_performing_roasters: [],
    },
    growth_insights: {
      month_over_month_growth: 0,
      trending_regions: [],
      emerging_roasters: [],
    },
  };
}
