using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using NMS_API.Dtos.AnnualReqDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;

namespace NMS_API.Services.Interfaces
{
    public interface IAnnualRequirementRepository
    {
        Task<AnnualRequirementMst> SaveAnnualRequirementMst(AnnualRequirementMst requirementMst, int? userId);
        Task<AnnualRequirementMst> EditAnnualRequirementMst(AnnualRequirementMst requirementMst, int? userId);
        Task<IEnumerable<AnnualRequirementDtl>> SaveAnnualRequirementDtl(IEnumerable<AnnualRequirementDtl> requirementDtls);
        Task<AnnualRequirementMst> SubmitAnnualRequirement(AnnualRequirementMst requirementMst, int? userId);
        Task<IEnumerable<AnnualRequirementMst>> GetAnnualRequirementsByImporter(int importerId);
        Task<PagedResultDto<AnnualRequirementMst>> GetAllAnnualRequirements(GetAllInputFilter input);
        Task<IEnumerable<AnnualRequirementMst>> GetAllAnnualRequirements();
        Task<IEnumerable<AnnualRequirementMst>> GetAllAnnualReqMst();
        Task<IEnumerable<AnnualRequirementDtl>> GetAnnualReqDtlByMstAndImporterId(AnnualReqByMstAndImpDto annualReqByMstAndImp);
        Task<ImporterInfo> GetImporterInfoByAnnualReq(AnnualReqByMstAndImpDto annualReqByMstAndImp);
        Task<bool> IsAnnualRequirementAlreadySubmittedThisYear(int importerId);
        Task<bool> IsAnnualRequirementExist(int importerId);
    }
}
