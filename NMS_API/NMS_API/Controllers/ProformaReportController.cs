using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.CommonDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Dtos.ProformaInvoiceReportDtos;
using NMS_API.Dtos.ReportDto;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProformaReportController : ControllerBase
    {
        private readonly IProformaReportRepository _repository;
        public ProformaReportController(IProformaReportRepository repository)
        {
            _repository = repository;
        }
        [Authorize(Roles = "Importer")]
        [HttpPost("GetDateWiseProformaByImporter")]
        public async Task<ActionResult<IEnumerable<ProformaInvoiceMst>>> GetDateWiseProformaByImporter(ProformaInvoiceSearchDto searchDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (userId != searchDto.ImporterId)
                return BadRequest();
            var profInfos = await _repository.GetDateWiseProformaByImporter(searchDto);
            return profInfos.ToList();
        }
        [Authorize(Roles = "Importer")]
        [HttpPost("GetImporterWiseCurrentYearProforma")]
        public async Task<ActionResult<IEnumerable<ProformaInvoiceMst>>> GetImporterWiseCurrentYearProforma(ImporterIdDto importer)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (userId != importer.ImporterId)
                return BadRequest();
            var proformaInfos = await _repository.GetImporterWiseCurrentYearProforma(importer.ImporterId);
            return proformaInfos.ToList();
        }
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("GetCurrentYearProformaInfo")]
        public async Task<ActionResult<IEnumerable<ProformaInvoiceMst>>> GetCurrentYearProformaInfo(UserIdDto user)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (user.UserId != userId)
                return BadRequest("UnAuthorized Access");
            var proformaInfos = await _repository.GetCurrentYearProformaInfo();
            return proformaInfos.ToList();
        }
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("GetDateWiseProformaInfos")]
        public async Task<ActionResult<IEnumerable<ProformaInvoiceMst>>> GetDateWiseProformaInfos(AllProformaInvoiceSearchDto searchDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (userId != searchDto.UserId)
                return BadRequest();
            var profInfos = await _repository.GetDateWiseProformaInfos(searchDto);
            return profInfos.ToList();
        }

    }
}