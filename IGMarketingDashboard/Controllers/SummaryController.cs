using IGMarketingDashboard.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace IGMarketingDashboard.Controllers
{
    public class SummaryController : ApiController
    {
        public IList<SummaryModel> Get(string startRangeBegin, string startRangeEnd, string endRangeBegin, string endRangeEnd)
        {
            DateTime startRangeBeginDate;
            DateTime startRangeEndDate;
            DateTime endRangeBeginDate;
            DateTime endRangeEndDate;

            bool _continue = true;

            if (!DateTime.TryParse(startRangeBegin, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out startRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(startRangeEnd, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out startRangeEndDate)) _continue = false;
            if (!DateTime.TryParse(endRangeBegin, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out endRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(endRangeEnd, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out endRangeEndDate)) _continue = false;

            IList<SummaryModel> models = new List<SummaryModel>();

            _continue = SummaryDataRepository.RangesAreEqualSize(startRangeBeginDate, startRangeEndDate, endRangeBeginDate, endRangeEndDate);

            if (_continue)
            {

                SummaryDataRepository repository = new SummaryDataRepository();
                repository.CalculateNumberOfDays(startRangeBeginDate, startRangeEndDate);

                var data = SummaryData.CreateCollection(repository);

                models = SummaryModel.CreateCollection(data);
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            return models;
        }
    }
}