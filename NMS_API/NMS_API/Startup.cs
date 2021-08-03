using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using NMS_API.Data;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Abp.Application.Services;
using NMS_API.Services.Interfaces;
using NMS_API.Services.Repositories;
using NMS_API.Services.Exporting;
using Abp.Runtime.Caching;

namespace NMS_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<NmsDataContext>(x => x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddControllersAsServices();
                // custom addJson NamingStrategy using Newtonsoft.Json.Serialization;
                //.AddJsonOptions(options => {
                //    var resolver = options.SerializerSettings.ContractResolver;
                //    if (resolver != null)
                //        (resolver as DefaultContractResolver).NamingStrategy = null;
                //});
            services.AddCors();
            services.AddTransient<IStudentRepository, StudentRepository>();
            //services.AddTransient<IApplicationService, ApplicationService>();
            services.AddTransient<IAuthRepository, AuthRepository>();
            services.AddTransient<ICurrencyRepository, CurrencyRepository>();
            services.AddTransient<IAnnualRequirementRepository, AnnualRequirementRepository>();
            services.AddTransient<IEmployeeInfoAppService, EmployeeAppService>();
            services.AddTransient<IEmployeeInfoRepository, EmployeeInfoRepository>();
            services.AddTransient<IProformaInvoiceRepository, ProformaInvoiceRepository>();
            services.AddTransient<IImporterInfoRepository, ImporterInfoRepository>();
            services.AddTransient<ITempFileCacheManager, TempFileCacheManager>();
            //services.AddTransient<ICacheManager>();
             services.AddTransient<IRoleInfoRepository, RoleInfoRepository>();
            services.AddTransient<IUserRoleConfRepository, UserRoleConfRepository>();
            services.AddTransient<IImporterExcelExporter, ImporterExcelExporter>();
            services.AddTransient<IProformaInvoiceApprovalRepository, ProformaInvoiceApprovalRepository>();
            services.AddTransient<IDashboardRepository, DashboardRepository>();
            services.AddTransient<IProformaReportRepository, ProformaReportRepository>();
            services.AddTransient<ICurrencyRateRepository, CurrencyRateRepository>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(options => {
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                                       .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                   ValidateIssuer = false,
                   ValidateAudience = false
               };
           });

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info { Title = "NMS API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                //Note: This is just for showing Authorize button on the UI. 
                //Authorize button's behaviour is handled in wwwroot/swagger/ui/index.html
                options.AddSecurityDefinition("Bearer", new BasicAuthScheme());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (httpContext,next) =>
            {
                await next();
                if(httpContext.Response.StatusCode == 204){
                    httpContext.Response.ContentLength = 0;
                }
            });
            app.UseAuthentication();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });
            // app.UseMvc();
            app.UseMvc(routes =>
            {
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "fallback", action = "Index" }
                );
            });
            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger();
            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "NMS Swagger API V1");
            }); //URL: /swagger
        }
    }
}
