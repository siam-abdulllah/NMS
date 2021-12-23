using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos;
using NMS_API.Dtos.AnnualReqDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnualRequirementController : ControllerBase
    {
        private readonly IAnnualRequirementRepository _annualReqRepository;
        public AnnualRequirementController(IAnnualRequirementRepository annualReqRepository)
        {
            _annualReqRepository = annualReqRepository;
        }
        [Authorize(Roles = "Importer, SA")]
        [HttpPost("SaveAnnualRequirementMst")]
        public async Task<ActionResult<AnnualRequirementMst>> SaveAnnualRequirementMst(AnnualRequirementMst annualRequirementMst)
        {
            try
            {
                var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
                if (annualRequirementMst.ImporterId != userId )
                    return BadRequest("Unauthorized access");
                var res = await _annualReqRepository.IsAnnualRequirementAlreadySubmittedThisYear(annualRequirementMst.ImporterId);
                if (res)
                    return BadRequest("Annual Requirement already submitted this year");
                var annualReqMst = await _annualReqRepository.SaveAnnualRequirementMst(annualRequirementMst, userId);
                return annualReqMst;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [Authorize(Roles = "Importer,SA")]
        [HttpPost("UpdateAnnualRequirementMst")]
        public async Task<ActionResult<AnnualRequirementMst>> UpdateAnnualRequirementMst(AnnualRequirementMst annualRequirementMst)
        {
            try
            {
                var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
                var res = await _annualReqRepository.IsAnnualRequirementAlreadySubmittedThisYear(annualRequirementMst);
                if (!res)
                    return BadRequest("Privious fiscal year Annual Requirement can not be updated");
                var annualReqMst = await _annualReqRepository.EditAnnualRequirementMst(annualRequirementMst, userId);
                return annualReqMst;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [Authorize(Roles = "Importer,SA")]
        [HttpPost("SubmitAnnualRequirement")]
        public async Task<AnnualRequirementMst> SubmitAnnualRequirement(AnnualRequirementMst requirementMst)
        {
            try 
            { 
                var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
                var annualReqMst = await _annualReqRepository.SubmitAnnualRequirement(requirementMst, userId);
                return annualReqMst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [Authorize(Roles = "Importer, SA")]
        [HttpPost("SaveAnnualRequirementDtl")]
        public async Task<ActionResult<IEnumerable<AnnualRequirementDtl>>>
            SaveAnnualRequirementDtl(IEnumerable<AnnualRequirementDtl> annualRequirementDtls)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var annReqDtls = await _annualReqRepository.SaveAnnualRequirementDtl(annualRequirementDtls, userId);
            return annReqDtls.ToList();
        }
        [Authorize(Roles = "Importer, SA")]
        [HttpPost("GetAnnualRequirementsByImporter")]
        public async Task<IEnumerable<AnnualRequirementMst>> GetAnnualRequirementsByImporter(ImporterForProformaDto importerForProformaDto)
        {
            var annualRequirements = await _annualReqRepository.GetAnnualRequirementsByImporter(importerForProformaDto.ImporterId);
            return annualRequirements;
        }
        //
        [Authorize(Roles = "SA")]
        [HttpPost("GetAllAnnualRequirements")]
        public async Task<PagedResultDto<AnnualRequirementMst>> GetAllAnnualRequirements(GetAllInputFilter input)
        {
            var result = await _annualReqRepository.GetAllAnnualRequirements(input);
            return result;
        }
        [Authorize(Roles = "SA")]
        [HttpGet("GetAllAnnualRequirements")]
        public async Task<IEnumerable<AnnualRequirementMst>> GetAllAnnualRequirements()
        {
            var result = await _annualReqRepository.GetAllAnnualRequirements();
            return result;
        }
        //
        [Authorize(Roles = "Importer, SA")]
        [HttpPost("GetAnnualReqDtlByMstAndImporterId")]
        public async Task<IEnumerable<AnnualRequirementDtl>> GetAnnualReqDtlByMstAndImporterId(AnnualReqByMstAndImpDto annualReqByMstAndImp)
        {
            var annReqDtls = await _annualReqRepository.GetAnnualReqDtlByMstAndImporterId(annualReqByMstAndImp);
            return annReqDtls;
        }

        [Authorize(Roles = "Importer, SA")]
        [HttpPost("GetImporterInfoByAnnualReq")]
        public async Task<ActionResult<ImporterInfo>> GetImporterInfoByAnnualReq(AnnualReqByMstAndImpDto annualReqByMstAndImp)
        {
            var importerInfo = await _annualReqRepository.GetImporterInfoByAnnualReq(annualReqByMstAndImp);
            return importerInfo;
        }
        [Authorize(Roles = "Importer, SA")]
        [HttpPost("IsAnnualRequirementAlreadySubmittedThisYear")]
        public async Task<ActionResult<bool>> IsAnnualRequirementAlreadySubmittedThisYear(ImporterForProformaDto importer)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            bool res = false;
            if (userId != importer.ImporterId)
                return BadRequest("Unauthorized access");
            res = await _annualReqRepository.IsAnnualRequirementAlreadySubmittedThisYear(importer.ImporterId);
            if (res)
                return true;
            return false;
        }

        [Authorize(Roles = "Importer, SA")]
        [HttpPost("IsAnnualRequirementExist")]
        public async Task<ActionResult<bool>> IsAnnualRequirementExist(ImporterForProformaDto importer)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            bool res = false;
            if (userId != importer.ImporterId)
                return BadRequest("Unauthorized access");
            res = await _annualReqRepository.IsAnnualRequirementExist(importer.ImporterId);
            if (res)
                return true;
            return false;
        }
        [Authorize(Roles = "Importer, SA")]
        [HttpPost("IsProdAlreadyPI")]
        public ActionResult<bool> IsProdAlreadyPI(AnnualRequirementDtl annualRequirementDtls)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            bool res = false;
            res = _annualReqRepository.IsProdAlreadyPI(annualRequirementDtls, userId);
            if (res)
                return true;
            return false;
        }
    }
}