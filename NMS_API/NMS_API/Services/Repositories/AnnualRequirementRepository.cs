using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.AnnualReqDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using NMS_API.Services.Common;
using NMS_API.Services.Interfaces;
//
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;

namespace NMS_API.Services.Repositories
{
    public class AnnualRequirementRepository : IAnnualRequirementRepository
    {
        private readonly NmsDataContext _nmsDataContext;
        public AnnualRequirementRepository(NmsDataContext nmsDataContext)
        {
            _nmsDataContext = nmsDataContext;
        }

        public async Task<IEnumerable<AnnualRequirementMst>> GetAllAnnualReqMst()
        {
            var allAnnReqMst = await _nmsDataContext.AnnualRequirementMsts.ToListAsync();
            return allAnnReqMst;
        }

  

        public async Task<IEnumerable<AnnualRequirementDtl>> GetAnnualReqDtlByMstAndImporterId(AnnualReqByMstAndImpDto ann)
        {
            var annReqMst = await _nmsDataContext.AnnualRequirementMsts.FirstOrDefaultAsync(x => x.Id == ann.MstId && x.AnnualReqNo == ann.AnnualReqNo && x.ImporterId == ann.ImporterId);
            var annReqDtls = await _nmsDataContext.AnnualRequirementDtls.Where(x => x.AnnReqMstId == annReqMst.Id).ToListAsync();
            return annReqDtls;
        }

        public async Task<IEnumerable<AnnualRequirementMst>> GetAnnualRequirementsByImporter(int importerId)
        {
            try
            {
                var annualRequirements = await _nmsDataContext.AnnualRequirementMsts
                .Include(x => x.AnnualRequirementDtls)
                .Where(i => i.ImporterId == importerId).ToListAsync();
                return annualRequirements;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<PagedResultDto<AnnualRequirementMst>> GetAllAnnualRequirements(GetAllInputFilter input)
        {
            try
            {
                //var annualRequirements = await _nmsDataContext.AnnualRequirementMsts
                //.Include(x => x.AnnualRequirementDtls)
                //.ToListAsync();
                // return annualRequirements;

                var annualRequirements = (from a in _nmsDataContext.AnnualRequirementMsts
                                          where a.Confirmation == true && (a.AnnualReqNo.Contains(input.Filter) || a.ImporterId.ToString().Contains(input.Filter))

                                    select new AnnualRequirementMst
                                    {
                                        Id = a.Id,
                                        AnnualReqNo = a.AnnualReqNo,
                                        ImporterId = a.ImporterId,
                                        Confirmation = a.Confirmation,
                                        SubmissionDate = a.SubmissionDate,
                                        AnnualRequirementDtls= _nmsDataContext.AnnualRequirementDtls.Where(x => x.AnnReqMstId == a.Id).ToList()
                                    });

                var totalCount = await annualRequirements.CountAsync();

                var results = await annualRequirements
                    .OrderBy(input.Sorting ?? "e => e.Id desc")
                    .PageBy(input)
                    .ToListAsync();

                return new PagedResultDto<AnnualRequirementMst>(
                    totalCount,
                    results
                    );
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<AnnualRequirementMst>> GetAllAnnualRequirements()
        {
            try
            {
                var annualRequirements = await _nmsDataContext.AnnualRequirementMsts
                .Include(x => x.AnnualRequirementDtls)
                .ToListAsync();
                return annualRequirements;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<AnnualRequirementDtl>> SaveAnnualRequirementDtl(IEnumerable<AnnualRequirementDtl> requirementDtls)
        {
            try
            {
                if (requirementDtls.Count() > 0)
                {
                    foreach (var d in requirementDtls)
                    {
                        if (d.Id !=0)
                        {
                            AnnualRequirementDtl annualRequirementDtl = await _nmsDataContext.AnnualRequirementDtls.FirstOrDefaultAsync(i => i.Id == d.Id);
                            if (annualRequirementDtl != null)
                            {
                                annualRequirementDtl.Id = d.Id;
                                annualRequirementDtl.AnnReqMstId = d.AnnReqMstId;
                                annualRequirementDtl.ProdName = d.ProdName;
                                annualRequirementDtl.ProdType = d.ProdType;
                                annualRequirementDtl.HsCode = d.HsCode;
                                annualRequirementDtl.Manufacturer = d.Manufacturer;
                                annualRequirementDtl.CountryOfOrigin = d.CountryOfOrigin;
                                annualRequirementDtl.PackSize = d.PackSize;
                                annualRequirementDtl.Currency = d.Currency;
                                annualRequirementDtl.TotalAmount = d.TotalAmount;
                                annualRequirementDtl.TentativeUnits = d.TentativeUnits;
                                annualRequirementDtl.UnitPrice = d.UnitPrice;
                                annualRequirementDtl.ExchangeRate = d.ExchangeRate;
                                annualRequirementDtl.TotalPrice = d.TotalPrice;
                                annualRequirementDtl.TotalPriceInBdt = d.TotalPriceInBdt;
                                
                                _nmsDataContext.AnnualRequirementDtls.Update(annualRequirementDtl);
                                await _nmsDataContext.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            await _nmsDataContext.AnnualRequirementDtls.AddAsync(d);
                            await _nmsDataContext.SaveChangesAsync();
                        }
                    }
                }
                return requirementDtls;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AnnualRequirementMst> SaveAnnualRequirementMst(AnnualRequirementMst requirementMst, int? userId)
        {
            try
            {
                var totalAnnualReq = await GetAllAnnualReqMst();
                var maxAnnReqNo = Convert.ToInt32(totalAnnualReq.Max(x => x.AnnualReqNo));
                NumberGenerator numberGenerator = new NumberGenerator();
                var annReqNo = numberGenerator.GenerateAnnualReqNo(maxAnnReqNo+1, 6);
                //requirementMst.SubmissionDate = DateTime.Now;
                requirementMst.SubmissionDate = null;
                requirementMst.Confirmation = false;
                requirementMst.AnnualReqNo = annReqNo;
                requirementMst.InsertedBy = userId;
                requirementMst.InsertedDate = DateTime.Now;
                await _nmsDataContext.AnnualRequirementMsts.AddAsync(requirementMst);
                await _nmsDataContext.SaveChangesAsync();
                return requirementMst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<AnnualRequirementMst> EditAnnualRequirementMst(AnnualRequirementMst requirementMst, int? userId)
        {
            var dt = DateTime.Now;
            AnnualRequirementMst annualRequirementMst = await _nmsDataContext.AnnualRequirementMsts.FirstOrDefaultAsync(i => i.AnnualReqNo == requirementMst.AnnualReqNo);
            if (annualRequirementMst != null)
            {
                annualRequirementMst.Confirmation = false;
                annualRequirementMst.UpdatedBy = userId;
                annualRequirementMst.UpdatedDate = DateTime.Now;
                requirementMst.SubmissionDate = null;
            }
            _nmsDataContext.AnnualRequirementMsts.Update(annualRequirementMst);
            await _nmsDataContext.SaveChangesAsync();
            //var updatedCurrencyRate = await GetCurrencyRate(currencyRate.Id);
            return annualRequirementMst;
        }
        public async Task<AnnualRequirementMst> SubmitAnnualRequirement(AnnualRequirementMst requirementMst, int? userId)
        {
            var dt = DateTime.Now;
            AnnualRequirementMst annualRequirementMst = await _nmsDataContext.AnnualRequirementMsts
                .FirstOrDefaultAsync(i => i.AnnualReqNo == requirementMst.AnnualReqNo 
                && i.Id==requirementMst.Id && i.ImporterId==requirementMst.ImporterId);

            if (annualRequirementMst != null)
            {
                annualRequirementMst.Confirmation = true;
                annualRequirementMst.UpdatedBy = userId;
                annualRequirementMst.UpdatedDate = DateTime.Now;
                annualRequirementMst.SubmissionDate = DateTime.Now;
            }
            _nmsDataContext.AnnualRequirementMsts.Update(annualRequirementMst);
            await _nmsDataContext.SaveChangesAsync();
            //var updatedCurrencyRate = await GetCurrencyRate(currencyRate.Id);
            return annualRequirementMst;
        }
        public async Task<bool> IsAnnualRequirementAlreadySubmittedThisYear(int importerId)
        {
            int year = DateTime.Now.Year;
            DateTime first_Date_Of_Fiscal_Year = new DateTime(year, 7, 1);
            DateTime currentDate = DateTime.Now;
            int lastyear = 0;
            if (first_Date_Of_Fiscal_Year > currentDate)
            {
                lastyear = DateTime.Now.AddYears(-1).Year;
            }
            else
            {
                lastyear = year;
                try
                {
                    //DateTime y = DateTime.Now.AddYears(1);
                    year = DateTime.Now.AddYears(1).Year;

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            DateTime firstDay = new DateTime(lastyear, 7, 1);
            DateTime lastDay = new DateTime(year, 6, 30);
            var lastDate = lastDay.AddHours(23).AddMinutes(59).AddSeconds(59);
            var annualReqMst = await _nmsDataContext.AnnualRequirementMsts.FirstOrDefaultAsync(x => x.SubmissionDate >= firstDay && x.SubmissionDate <= lastDate && x.ImporterId == importerId);
            if (annualReqMst == null)
                return false;
            return true;
        }

        public async Task<bool> IsAnnualRequirementExist(int importerId)
        {
            int year = DateTime.Now.Year;
            DateTime first_Date_Of_Fiscal_Year = new DateTime(year, 7, 1);
            DateTime currentDate = DateTime.Now;
            int lastyear = 0;
            if (first_Date_Of_Fiscal_Year > currentDate)
            {
                lastyear = DateTime.Now.AddYears(-1).Year;
            }
            else
            {
                lastyear = year;
                try
                {
                    //DateTime y = DateTime.Now.AddYears(1);
                    year = DateTime.Now.AddYears(1).Year;

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            DateTime firstDay = new DateTime(lastyear, 7, 1);
            DateTime lastDay = new DateTime(year, 6, 30);
            var lastDate = lastDay.AddHours(23).AddMinutes(59).AddSeconds(59);
            var annualReqMst = await _nmsDataContext.AnnualRequirementMsts.FirstOrDefaultAsync(x => x.InsertedDate >= firstDay && x.InsertedDate <= lastDate && x.ImporterId == importerId);
            if (annualReqMst == null)
                return false;
            return true;
        }

        public async Task<ImporterInfo> GetImporterInfoByAnnualReq(AnnualReqByMstAndImpDto annualReqByMstAndImp)
        {
            try
            {

                var importerInfo = await _nmsDataContext.ImporterInfos
                .FirstOrDefaultAsync(x => x.Id == annualReqByMstAndImp.ImporterId);

                return importerInfo;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
     }
}
