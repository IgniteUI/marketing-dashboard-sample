using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace IGMarketingDashboard.Models
{
    public class TrafficStats : ITrafficStats
    {
        public TrafficStats()
        {
            perLocation = new List<LocationTraffic>();
            perMedium = new List<TrafficStats>();
        }

        public string title { get; set; }
        public int session { get; set; }
        public int conversion { get; set; }
        public List<LocationTraffic> perLocation { get; set; }
        [ScriptIgnore]
        public List<TrafficStats> perMedium { get; set; }
    }

    public class MediumTraffic : ITrafficStats
    {
        public string title { get; set; }
        public int organic { get; set; }
        public int paid { get; set; }
        public int direct { get; set; }
        public int referral { get; set; }
        public int email { get; set; }

        public int session { get; set; }
        public int conversion { get; set; }
    }

    public class LocationTraffic : Location , ITrafficStats
    {
        [ScriptIgnore]
        public int scale { get; set; }
        public int scaledSessions { 
            get {
                return session / scale;
            }
        }

        public int conversion { get; set; }
        public int session { get; set; }
    }

    public class Location {
        public string country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public Location()
        {

        }
        public Location(string country, double Latitude, double Longitude)
        {
            this.country = country;
            this.Latitude = Latitude;
            this.Longitude = Longitude;
        }
    }

    interface ITrafficStats
    {
        int conversion { get; set; }
        int session { get; set; }
    }
}