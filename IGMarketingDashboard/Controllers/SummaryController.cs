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

            if (!DateTime.TryParse(startRangeBegin, out startRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(startRangeEnd, out startRangeEndDate)) _continue = false;
            if (!DateTime.TryParse(endRangeBegin, out endRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(endRangeEnd, out endRangeEndDate)) _continue = false;

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