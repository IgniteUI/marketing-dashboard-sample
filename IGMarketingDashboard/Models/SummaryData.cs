using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace IGMarketingDashboard.Models
{
    public class SummaryData
    {
        public int Sessions { get; set; }
        public int SessionsPercent { get; set; }
        public int Conversions { get; set; }
        public int Spend { get; set; }
        public decimal ConversionCosts { get; set; }
        public decimal Users { get; set; }
        public decimal ConversionRate { get; set; }
        public int ReferringDomains { get; set; }
        public int BrandedSearches { get; set; }
        public int SocialTrend { get; set; }
        public string[] TopPages { get; set; }
        public string[] Keywords { get; set; }
        public int PPC { get; set; }
        public int PPCTarget { get; set; }
        public int Banners { get; set; }
        public int BannersTarget { get; set; }
        public int Email { get; set; }
        public int EmailTarget { get; set; }
        public int ThirdParty { get; set; }
        public int ThirdPartyTarget { get; set; }
        public int OnlineSales { get; set; }

        public static SummaryData Create(SummaryDataRepository repository)
        {
            int conversions = repository.GetConversions();
            int sessions = repository.GetSessions();
            decimal conversionRate = ((decimal)conversions / (decimal)sessions) * 100;
            CampaignData data = repository.GetCampaignData(conversions);

            SummaryData returnValue = new SummaryData()
            {
                Sessions = sessions,

                Conversions = conversions,

                Spend = repository.GetSpend(),

                ConversionCosts = repository.GetConversionCosts(),

                ReferringDomains = repository.GetReferringDomains(),

                BrandedSearches = repository.GetBrandedSearches(),

                SocialTrend = repository.GetSocialTrend(),

                ConversionRate = conversionRate, 

                OnlineSales = repository.GetOnlineSales(),

                Users = sessions,

                PPC = data.PPC,
                PPCTarget = data.PPCTarget,

                Banners = data.Banners,
                BannersTarget = data.BannersTarget,

                Email = data.Email,
                EmailTarget = data.EmailTarget,

                ThirdParty = data.ThirdParty,
                ThirdPartyTarget = data.ThirdPartyTarget,

                TopPages = repository.GetPageList(),
                Keywords = repository.GetWordList(),
                
                TrafficStats = repository.GetTrafficStats(sessions, conversions)
            };

            return returnValue;
        }
        public static IList<SummaryData> CreateCollection(SummaryDataRepository repository)
        {
            List<SummaryData> models = new List<SummaryData>();

            SummaryData start = SummaryData.Create(repository);
            SummaryData end = SummaryData.Create(repository);

            models.Add(start);
            models.Add(end);

            return models;
        }

        public TrafficStats[] TrafficStats { get; set; }
    }
}