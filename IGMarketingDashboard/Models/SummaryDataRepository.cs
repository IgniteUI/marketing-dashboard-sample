using System;
using System.Collections.Generic;

namespace IGMarketingDashboard.Models
{
    /// <summary>
    /// This class is responsible for generating random 
    /// data for the dashboard. Numbers are adjusted for
    /// the date ranges passed into the system.
    /// </summary>
    public class SummaryDataRepository
    {
        private Random _random = new Random();
        private int _numberOfDays;

        public static bool RangesAreEqualSize(DateTime startRangeBegin, DateTime startRangeEnd, DateTime endRangeBegin, DateTime endRangeEnd)
        {
            TimeSpan beginSpan;
            TimeSpan endSpan;

            beginSpan = startRangeEnd.Subtract(startRangeBegin);
            endSpan = endRangeEnd.Subtract(endRangeBegin);
            
            int val = beginSpan.Days - endSpan.Days;
            if ((DateTime.IsLeapYear(startRangeBegin.Year) && val == 1 && beginSpan.Days == 366)
                || (DateTime.IsLeapYear(endRangeBegin.Year) && val == 1 && endSpan.Days == 366))
	        {
                return true;
	        }
            return val == 0;
        }

        public void CalculateNumberOfDays(DateTime? start, DateTime? end)
        {
            if (start.HasValue && end.HasValue)
            {
                TimeSpan span;
                span = end.Value.Subtract(start.Value);
                this._numberOfDays = span.Days;
            }
            else
            {
                this._numberOfDays = 365;
            }
        }

        private decimal GetDecimal(decimal min, decimal max)
        {
            // values are adjusted as they come in 
            // in order to randomly generate decimal
            // values
            decimal adjuster = 1000M;
            int value = _random.Next(Convert.ToInt32(min * adjuster), Convert.ToInt32(max * adjuster));
            return (Convert.ToDecimal(value / adjuster));
        }

        private int GetInt(int min, int max)
        {
            return _random.Next(min, max);
        }

        private int GetValue(int annualMin, int annualMax)
        {
            int dailyMin = Convert.ToInt32(Math.Round((decimal)annualMin / 365, 0));
            int dailyMax = Convert.ToInt32(Math.Round((decimal)annualMax / 365, 0));

            int value = this.GetInt(dailyMin, dailyMax);
            value = value * this._numberOfDays;
            return value;
        }

        public int GetSessions()
        {
            return this.GetValue(300000, 500000);
        }

        public int GetConversions()
        {
            return this.GetValue(6000, 8000);
        }

        public int GetSpend()
        {
            return this.GetValue(150000, 215000);
        }

        public decimal GetConversionCosts()
        {
            return this.GetDecimal(33, 78);
        }

        public int GetReferringDomains()
        {
            return this.GetValue(1800, 3000);
        }

        public int GetOnlineSales()
        {
            return this.GetValue(100000, 300000);
        }

        public int GetBrandedSearches()
        {
            return this.GetValue(1000, 3000);
        }

        public int GetSocialTrend()
        {
            return this.GetValue(100000, 300000);
        }

        public decimal GetConversionRate()
        {
            return this.GetDecimal(1, 7);
        }

        public decimal GetUsers()
        {
            return this.GetDecimal(15, 30);
        }

        private string[] GetUniqueList(string[] data, int size)
        {
            List<string> result = new List<string>();

            string value = string.Empty;

            while (result.Count < size)
            {
                value = data[_random.Next(0, data.Length - 1)];

                if (!result.Contains(value))
                {
                    result.Add(value);
                }
            }

            return result.ToArray();
        }

        public string[] GetWordList()
        {
            string[] words = Resources.Main.Top_Unbranded_Keywords_List.Split(',');
            return GetUniqueList(words, 10);
        }

        public string[] GetPageList()
        {
            string[] pages = Resources.Main.Top_Pages_List.Split(',');
            return GetUniqueList(pages, 4);
            
        }

        public CampaignData GetCampaignData(decimal conversions)
        {
            decimal amount = (decimal)_random.Next(14, 47);
            decimal percent = amount / 100;
            decimal initialAmount = (conversions * percent);
            decimal remaining = conversions - initialAmount;

            int halfOfConversions = Convert.ToInt32(conversions / 2);

            CampaignData returnValue = new CampaignData();

            int doBranch = _random.Next(1, 100);

            if (doBranch > 50)
            {
                returnValue.Email = Convert.ToInt32(initialAmount);
                returnValue.Banners = Convert.ToInt32(remaining * .75m);
                returnValue.PPC = Convert.ToInt32(remaining * .125m);
                returnValue.ThirdParty = Convert.ToInt32(remaining * .125m);
            }
            else
            {
                returnValue.PPC = Convert.ToInt32(initialAmount);
                returnValue.ThirdParty = Convert.ToInt32(remaining * .75m);
                returnValue.Email = Convert.ToInt32(remaining * .125m);
                returnValue.Banners = Convert.ToInt32(remaining * .125m);
            }

            returnValue.EmailTarget = halfOfConversions;
            returnValue.BannersTarget = halfOfConversions;
            returnValue.PPCTarget = halfOfConversions;
            returnValue.ThirdPartyTarget = halfOfConversions;

            return returnValue;
        }

        internal TrafficStats[] GetTrafficStats(int sessions, int conversions)
        {
            int divisor = 4, mapScale = 50;
            string label = string.Empty;
            List<TrafficStats> stats = new List<TrafficStats>();

            if (this._numberOfDays == 7)
            {
                label = Resources.Main.Day;
                divisor = 7;
                mapScale = 5;
            }
            else if (this._numberOfDays > 7 && this._numberOfDays <= 31)
            {
                label = Resources.Main.Week;
                divisor = 4;
            }
            else if (this._numberOfDays > 31 && this._numberOfDays <= 90)
            {
                label = Resources.Main.Week;
                divisor = 12;
            }
            else
            {
                label = Resources.Main.Month;
                divisor = this._numberOfDays / 30;
                mapScale = 200;
            }
            
            DistributeSessions(sessions, conversions, divisor, stats);
                        
            for (int i = 0; i < stats.Count; i++)
            {
                // label items in order after shuffle
                stats[i].title = string.Format(label, (i+1));

                DistributeSessions(stats[i].session, stats[i].conversion, Locations.Count, stats[i].perLocation);
                for (int j = 0; j < stats[i].perLocation.Count; j++)
                {
                    stats[i].perLocation[j].scale = mapScale;
                    stats[i].perLocation[j].country = Locations[j].country;
                    stats[i].perLocation[j].Latitude = Locations[j].Latitude;
                    stats[i].perLocation[j].Longitude = Locations[j].Longitude;
                }
                DistributeSessions(stats[i].session, stats[i].conversion, Mediums.Length, stats[i].perMedium);
                for (int j = 0; j < stats[i].perMedium.Count; j++)
                {
                    stats[i].perMedium[j].title = Mediums[j];
                }
            }

            return stats.ToArray();
        }

        private void DistributeSessions<T>(int sessions, int conversions, int divisor, List<T> stats) where T: ITrafficStats, new()
        {
            decimal sessionsValue = (decimal)sessions / (decimal)divisor;
            int sessionsChange = 0;

            decimal conversionsValue = (decimal)conversions / (decimal)divisor;
            int conversionsChange = 0;
            /*
             * In an attempt to keep the random data generated
             * make sense based off the number of sessions and
             * conversions passed in to the method, this logic 
             * splits the number of sessions/conversions evenly 
             * among  each period and then creates random variation 
             * in values.
             * 
             * The first pass randomly generates a "change value"
             * which is added to the current data. The second pass
             * subtracts the "change value" (by adding a negative number) 
             * to the value in order to make sure the total for 
             * the group doesn't exceed what was passed in as the 
             * total to the method.
             * 
             * After all this is complete then the list is shuffled
             * in order to make the data appear random even though
             * there is a pattern to the way the data is generated.
             */
            T item;
            for (int i = 0; i < divisor; i++)
            {
                item = new T();

                if (i % 2 == 0)
                {
                    sessionsChange = this._random.Next(
                        Convert.ToInt32(sessionsValue * 0.1m),
                        Convert.ToInt32(sessionsValue * 0.9m));

                    conversionsChange = this._random.Next(
                        Convert.ToInt32(conversionsValue * 0.1m),
                        Convert.ToInt32(conversionsValue * 0.9m));
                }
                else
                {
                    sessionsChange = sessionsChange * -1;
                    conversionsChange = conversionsChange * -1;
                }

                item.session = Convert.ToInt32(sessionsValue + sessionsChange);
                item.conversion = Convert.ToInt32(conversionsValue + conversionsChange);
                stats.Add(item);
            }

            stats.Shuffle();
        }

        private List<Location> Locations = new List<Location> {
            new Location(  Resources.Main.Poland,  52.21,  21 ),
            new Location(  Resources.Main.England,  51.50,  0.12 ),
            new Location(  Resources.Main.Germany,  52.50,  13.33 ),
            new Location(  Resources.Main.Russia,  55.75,  37.51 ),
            new Location(  Resources.Main.Australia,  -33.83,  151.2 ),
            new Location(  Resources.Main.Japan,  35.6895,  139.6917 ),
            new Location(  Resources.Main.South_Korea,  37.5665,  126.9780 ),
            new Location(  Resources.Main.India,  28.6353,  77.2250 ),
            new Location(  Resources.Main.India,  19.0177,  72.8562 ),
            new Location(  Resources.Main.Philippines,  14.6010,  120.9762 ),
            new Location(  Resources.Main.China,  31.2244,  121.4759 ),
            new Location(  Resources.Main.Mexico,  19.4270,  -99.1276 ),
            new Location(  Resources.Main.United_States,  40.7561,  -73.9870 ),
            new Location(  Resources.Main.Brasil,  -23.5489,  -46.6388 ),
            new Location(  Resources.Main.United_States,  34.0522,  -118.2434 ),
            new Location(  Resources.Main.Bulgaria,  42.697845,  23.321925 )
        };

        private static string[] Mediums = new string[] { "organic", "paid", "direct", "referral", "email" };
    }
}