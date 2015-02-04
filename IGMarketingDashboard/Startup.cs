using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(IGMarketingDashboard.Startup))]
namespace IGMarketingDashboard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
