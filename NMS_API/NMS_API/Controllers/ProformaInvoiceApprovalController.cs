using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.ProformaApprovalDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;


namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProformaInvoiceApprovalController : ControllerBase
    {
        private readonly IProformaInvoiceApprovalRepository _repository;
        public ProformaInvoiceApprovalController(IProformaInvoiceApprovalRepository repository)
        {
            _repository = repository;
        }
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("GetDateWiseSubmittedProformaInvoice")]
        public async Task<IEnumerable<ProformaInvoiceMst>>GetDateWiseSubmittedProformaInvoice(ProformaApprovalDateRangeDto dateRangeDto)
        {
            var ProInvs = await _repository.GetDateWiseSubmittedProformaInvoice(dateRangeDto);
            return ProInvs;
        }
        //Ashiq added
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("GetDateWiseApprovalProformaInvoice")]
        public async Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseApprovalProformaInvoice(ProformaApprovalDateRangeForNocDto dateRangeDto)
        {
            var result = await _repository.GetDateWiseApprovalProformaInvoice(dateRangeDto);
            return result;
        }

        [Authorize(Roles = "Admin,SA")]
        [HttpGet("GetAllPendingPorformaInvoices")]
        public async Task<IEnumerable<ProformaInvoiceMst>> GetAllPendingPorformaInvoices()
        {
            var proMsts = await _repository.GetAllPendingPorformaInvoices();
            return proMsts;
        }
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("ApproveProformaInvoice")]
        public async Task<ProformaInvoiceDtl> ApproveProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var proDtls = await _repository.ApproveProformaInvoice(proformaInvoiceDtl, userId);
            return proDtls;
        }
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("RejectProformaInvoice")]
        public async Task<ProformaInvoiceDtl> RejectProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var proDtls = await _repository.RejectProformaInvoice(proformaInvoiceDtl, userId);
            return proDtls;
        }
    }
}