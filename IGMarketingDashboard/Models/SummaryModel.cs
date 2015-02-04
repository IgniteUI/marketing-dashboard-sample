using System;
using System.Linq;
using System.Collections.Generic;
using System.Globalization;

namespace IGMarketingDashboard.Models
{
    public class SummaryModel
    {
        public string sessions { get; set; }
        public string sessionsPercent { get; set; }
        public string conversions { get; set; }
        public string spend { get; set; }
        public string conversionCosts { get; set; }
        public string users { get; set; }
        public string conversionRate { get; set; }
        public string referringDomains { get; set; }
        public string brandedSearches { get; set; }
        public string onlineSales { get; set; }
        public string socialTrend { get; set; }
        public string[] topPages { get; set; }
        public string[] keywords { get; set; }
        public int ppc { get; set; }
        public int ppcTarget { get; set; }
        public int banners { get; set; }
        public int bannersTarget { get; set; }
        public int email { get; set; }
        public int emailTarget { get; set; }
        public int thirdParty { get; set; }
        public int thirdPartyTarget { get; set; }
        public TrafficStats[] trafficStats { get; set; }
        public MediumTraffic[] trafficPerMedium { get; set; }

        private static string FormatDecimal(decimal value)
        {
            return value.ToString("#.##");
        }

        private static string FormatInt(int value)
        {
            return string.Format("{0:0,0}", value);
        }

        public static IList<SummaryModel> CreateCollection(IList<SummaryData> data)
        { 
            IList<SummaryModel> models = new List<SummaryModel>();

            foreach (SummaryData item in data)
            {
                models.Add(SummaryModel.Create(item));
            }

            return models;
        }

        private static string FormatUsers(decimal value)
        {
            int users = Convert.ToInt32(value);
            string returnValue = string.Empty;

            if (users < 1000000)
            {
                returnValue = string.Format("{0:0.#}K", users / 1000m);
            }
            else
            {
                returnValue = string.Format("{0:0.#}M", users / 10000m);
            }

            return returnValue;
        }

        public static SummaryModel Create(SummaryData data)
        {
            var model = new SummaryModel()
            {
                sessions = FormatInt(data.Sessions),

                conversions = FormatInt(data.Conversions),

                spend = FormatInt(data.Spend),

                conversionCosts = FormatDecimal(data.ConversionCosts),

                referringDomains = FormatInt(data.ReferringDomains),

                brandedSearches = FormatInt(data.BrandedSearches),

                socialTrend = FormatInt(data.SocialTrend),

                conversionRate = data.ConversionRate.ToString("0.0"),

                onlineSales = FormatInt(data.OnlineSales),

                users = FormatUsers(data.Sessions),

                ppc = data.PPC,
                ppcTarget = data.PPCTarget,

                banners = data.Banners,
                bannersTarget = data.BannersTarget,

                email = data.Email,
                emailTarget = data.EmailTarget,

                thirdParty = data.ThirdParty,
                thirdPartyTarget = data.ThirdPartyTarget,

                topPages = data.TopPages,
                keywords = data.Keywords
            };

            model.trafficStats = data.TrafficStats;

            model.trafficPerMedium = (from month in model.trafficStats
                                      select new MediumTraffic
                                      {
                                          title = month.title,
                                          session = month.session,
                                          conversion = month.conversion,
                                          organic = month.perMedium.Single(x => x.title == "organic").session,
                                          paid = month.perMedium.Single(x => x.title == "paid").session,
                                          direct = month.perMedium.Single(x => x.title == "direct").session,
                                          referral = month.perMedium.Single(x => x.title == "referral").session,
                                          email = month.perMedium.Single(x => x.title == "email").session,
                                      }).ToArray();

            return model;
        }
    }
}