using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.DashboardDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardRepository _repository;
        public DashboardController(IDashboardRepository repository)
        {
            _repository = repository;
        }
        [Authorize(Roles="Importer")]
        [HttpPost("GetImporterDashboardInfo")]
        public async Task<ActionResult<ImporterDashboardDto>> GetImporterDashboardInfo(ImporterIdDto importerIdDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (importerIdDto.ImporterId != userId)
                return BadRequest("UnAuthorized Access");
            var dashboard = await _repository.GetImporterDashboardInfo(userId);
            return dashboard;
        }
        [Authorize(Roles = "Admin, SA")]
        [HttpGet("GetAdminDashboardInfo")]
        public async Task<ActionResult<AdminDashboardDto>> GetAdminDashboardInfo()
        {
            var dashboard = await _repository.GetAdminDashboardInfo();
            return dashboard;
        }
    }
}