using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using NMS_API.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NMS_API.Services.Interfaces;

namespace NMS_API.Services.Repositories
{
    public class ProformaInvoiceRepository : IProformaInvoiceRepository
    {
        private readonly NmsDataContext _nmsDataContext;
        public ProformaInvoiceRepository(NmsDataContext nmsDataContext)
        {
            _nmsDataContext = nmsDataContext;
        }
        public async Task<IEnumerable<ProformaInvoiceMst>> GetAllProformaInvoiceMstByUser(ImporterIdDto importerIdDto)
        {
            var proformaInvoicemsts = await _nmsDataContext.ProformaInvoiceMsts.Where(y => y.ImporterId == importerIdDto.ImporterId).OrderByDescending(x => x.ProformaDate).ToListAsync();
            return proformaInvoicemsts;
        }
        public async Task<PiTotalAmountValidationDto> GetCrntYearTotlProformaInvAmtByProd(ProfInvTotalAmtDtoByProdDto profInvTotalAmtDtoByProdDto)
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
            var proformaCrntYear = await (from mst in _nmsDataContext.ProformaInvoiceMsts
                                          join dtl in _nmsDataContext.ProformaInvoiceDtls on mst.Id equals dtl.MstId
                                          where (mst.ImporterId == profInvTotalAmtDtoByProdDto.ImporterId && dtl.ProdName == profInvTotalAmtDtoByProdDto.ProdName && dtl.PackSize == profInvTotalAmtDtoByProdDto.PackSize
                                          && mst.ProformaDate >= firstDay && mst.ProformaDate <= lastDate && dtl.ApprovalStatus != false)
                                          select new
                                          {
                                              dtl.Id,
                                              dtl.ProdName,
                                              dtl.PackSize,
                                              dtl.ApprovalStatus,
                                              dtl.TotalAmount,
                                              ApprovalAmount = dtl.ApprovedAmount == null ? 0 : dtl.ApprovedAmount

                                          }).ToListAsync();
            double? totalProformaAmount = 0.0;
            foreach (var v in proformaCrntYear)
            {

                if(v.ApprovalStatus == true && v.ApprovalAmount != null)
                {
                    totalProformaAmount += v.ApprovalAmount;
                }
                else
                {
                    totalProformaAmount += v.TotalAmount;
                }
                
            }
            var annualreq = await (from mst in _nmsDataContext.AnnualRequirementMsts
                                   join dtl in _nmsDataContext.AnnualRequirementDtls on mst.Id equals dtl.AnnReqMstId
                                   where (mst.ImporterId == profInvTotalAmtDtoByProdDto.ImporterId && dtl.ProdName == profInvTotalAmtDtoByProdDto.ProdName && dtl.PackSize == profInvTotalAmtDtoByProdDto.PackSize
                                   && mst.SubmissionDate > firstDay && mst.SubmissionDate <= lastDate)
                                   select new
                                   {
                                       dtl.Id,
                                       dtl.ProdName,
                                       dtl.PackSize,
                                       dtl.TotalAmount
                                   }).FirstOrDefaultAsync();
            var totalAnnualAmount = annualreq.TotalAmount;
            var remainingAmount = totalAnnualAmount - totalProformaAmount;
            var totalAmtValidityDto = new PiTotalAmountValidationDto
            {
                AnnualTotalAmount = totalAnnualAmount,
                ProformaTotalAmount = totalProformaAmount,
                RemainingAmount = remainingAmount,
                ValidationStatus = profInvTotalAmtDtoByProdDto.TotalAmount > remainingAmount ? false : true
            };
            return totalAmtValidityDto;
        }

        //
        public async Task<PiTentitiveUnitValidationDto> GetCrntYearTentitiveProformaInvUnitByProd(ProfInvTotalAmtDtoByProdDto profInvTotalAmtDtoByProdDto)
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
                catch(Exception e)
                {
                    throw e;
                }
            }
            DateTime firstDay = new DateTime(lastyear, 7, 1);
            DateTime lastDay = new DateTime(year, 6, 30);
            var lastDate = lastDay.AddHours(23).AddMinutes(59).AddSeconds(59);
            var proformaCrntYear = await (from mst in _nmsDataContext.ProformaInvoiceMsts
                                          join dtl in _nmsDataContext.ProformaInvoiceDtls on mst.Id equals dtl.MstId
                                          where (mst.ImporterId == profInvTotalAmtDtoByProdDto.ImporterId && dtl.ProdName == profInvTotalAmtDtoByProdDto.ProdName && dtl.PackSize == profInvTotalAmtDtoByProdDto.PackSize
                                          && mst.ProformaDate >= firstDay && mst.ProformaDate <= lastDate && dtl.ApprovalStatus != false)
                                          select new
                                          {
                                              dtl.Id,
                                              dtl.ProdName,
                                              dtl.PackSize,
                                              dtl.ApprovalStatus,
                                              dtl.NoOfUnits,
                                              ApprovalAmount = dtl.ApprovedAmount == null ? 0 : dtl.ApprovedAmount

                                          }).ToListAsync();
            double? totalProformaUnit = 0.0;
            foreach (var v in proformaCrntYear)
            {

                if (v.ApprovalStatus == true && v.ApprovalAmount != null)
                {
                    totalProformaUnit += v.ApprovalAmount;
                }
                else
                {
                    totalProformaUnit += v.NoOfUnits;
                }

            }
            var annualreq = await (from mst in _nmsDataContext.AnnualRequirementMsts
                                   join dtl in _nmsDataContext.AnnualRequirementDtls on mst.Id equals dtl.AnnReqMstId
                                   where (mst.ImporterId == profInvTotalAmtDtoByProdDto.ImporterId && dtl.ProdName == profInvTotalAmtDtoByProdDto.ProdName && dtl.PackSize == profInvTotalAmtDtoByProdDto.PackSize
                                   && mst.SubmissionDate > firstDay && mst.SubmissionDate <= lastDate)
                                   select new
                                   {
                                       dtl.Id,
                                       dtl.ProdName,
                                       dtl.PackSize,
                                       dtl.TentativeUnits
                                   }).FirstOrDefaultAsync();
            var totalAnnualUnit = annualreq.TentativeUnits;
            var remainingAmount = totalAnnualUnit - totalProformaUnit;
            var tentitiveUnitValidityDto = new PiTentitiveUnitValidationDto
            {
                AnnualTentiveUnit = totalAnnualUnit,
                ProformaTentiveUnit = totalProformaUnit,
                RemainingAmount = remainingAmount,
                ValidationStatus = profInvTotalAmtDtoByProdDto.TentitiveUnit > remainingAmount ? false : true
            };
            return tentitiveUnitValidityDto;
        }
        public async Task<IEnumerable<ProformaInvoiceDtl>> GetProformaDtlsByProformaMst(int poMstId)
        {
            try
            {
                var proformaInvoiceDtls = await _nmsDataContext.ProformaInvoiceDtls.Where(x => x.MstId == poMstId).OrderByDescending(a => a.ProdName).ToListAsync();
                return proformaInvoiceDtls;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public async Task<IEnumerable<ProformaInvoiceDtl>> SaveProformaInvoiceDtl(IEnumerable<ProformaInvoiceDtl> proformaInvoiceDtl)
        {
            try
            {
                if (proformaInvoiceDtl.Count() > 0)
                {
                    foreach (var d in proformaInvoiceDtl)
                    {
                        await _nmsDataContext.ProformaInvoiceDtls.AddAsync(d);
                        await _nmsDataContext.SaveChangesAsync();
                    }
                }
                return proformaInvoiceDtl;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ProformaInvoiceMst> SaveProformaInvoiceMst(ProformaInvoiceMst proformaInvoiceMst)
        {
            try
            {
                var today = DateTime.Now;
                var formattedDate = today.ToString("ddMMyy"); //+ today.Month.ToString() + today.Year.ToString();
                if (formattedDate.Length < 6)
                {
                    formattedDate = "0" + formattedDate;
                }
                var proformaInvMsts = await GetAllProformaInvoiceMst();
                var maxProInvNo = Convert.ToInt32(proformaInvMsts.Max(x => x.ApplicationNo.Substring(6)));
                var numberGenerator = new NumberGenerator();
                var newProforMstNo = numberGenerator.GenerateProformaInvNo(maxProInvNo + 1, 6);
                //proformaInvoiceMst.ProformaInvoiceNo = newProforMstNo;
                proformaInvoiceMst.ApplicationNo = formattedDate + newProforMstNo;
                //proformaInvoiceMst.ProformaDate = DateTime.Now;
                proformaInvoiceMst.SubmissionDate = null;
                await _nmsDataContext.ProformaInvoiceMsts.AddAsync(proformaInvoiceMst);
                await _nmsDataContext.SaveChangesAsync();
                return proformaInvoiceMst;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public async Task<ProformaInvoiceMst> UpdatePiFilePath(int mstId, string[] Arr)
        {
            ProformaInvoiceMst targetedProforma = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == mstId);
            targetedProforma.PiScan = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            if (mstId > 0 && targetedProforma != null)
            {
                _nmsDataContext.ProformaInvoiceMsts.Attach(targetedProforma);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedProforma;
        }
        public async Task<ProformaInvoiceMst> UpdateLitFilePath(int mstId, string[] Arr)
        {
            ProformaInvoiceMst targetedProforma = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == mstId);
            targetedProforma.LitScan = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            if (mstId > 0 && targetedProforma != null)
            {
                _nmsDataContext.ProformaInvoiceMsts.Attach(targetedProforma);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedProforma;
        }
        public async Task<ProformaInvoiceMst> UpdateTestFilePath(int mstId, string[] Arr)
        {
            ProformaInvoiceMst targetedProforma = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == mstId);
            targetedProforma.TestReport = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            if (mstId > 0 && targetedProforma != null)
            {
                _nmsDataContext.ProformaInvoiceMsts.Attach(targetedProforma);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedProforma;
        }
        public async Task<ProformaInvoiceMst> UpdateOtherFilePath(int mstId, string[] Arr)
        {
            ProformaInvoiceMst targetedProforma = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == mstId);
            targetedProforma.OtherDoc = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            if (mstId > 0 && targetedProforma != null)
            {
                _nmsDataContext.ProformaInvoiceMsts.Attach(targetedProforma);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedProforma;
        }
        public async Task<ProformaInvoiceMst> UpdateProformaFilePath(int id, string[] Arr)
        {
            ProformaInvoiceMst targetedProforma = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(i => i.Id == id);

            targetedProforma.PiScan = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            targetedProforma.LitScan = Arr[1] == null ? null : Arr[1].Replace("\\", "/");
            targetedProforma.TestReport = Arr[2] == null ? null : Arr[2].Replace("\\", "/");
            targetedProforma.OtherDoc = Arr[3] == null ? null : Arr[3].Replace("\\", "/");
            if (id > 0 && targetedProforma != null)
            {
                _nmsDataContext.ProformaInvoiceMsts.Attach(targetedProforma);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedProforma;
        }
        public async Task<ProformaInvoiceMst> UpdateProformaInvoiceMst(ProformaInvoiceMstUpdateDto proformaInvoiceMstUpdateDto)
        {
            var proMst = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == proformaInvoiceMstUpdateDto.Id);
            proMst.Currency = proformaInvoiceMstUpdateDto.Currency;
            proMst.CountryOfOrigin = proformaInvoiceMstUpdateDto.CountryOfOrigin;
            proMst.PortOfLoading = proformaInvoiceMstUpdateDto.PortOfLoading;
            proMst.PortOfEntry = proformaInvoiceMstUpdateDto.PortOfEntry;
            proMst.ProformaInvoiceNo = proformaInvoiceMstUpdateDto.ProformaInvoiceNo;
            _nmsDataContext.ProformaInvoiceMsts.Attach(proMst);
            await _nmsDataContext.SaveChangesAsync();
            return proMst;
        }
        public async Task<bool> ValidateUpdateProMstClaim(int proMstId, int userId)
        {
            var proInvMst = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == proMstId);
            if (proInvMst.ImporterId == userId)
                return true;
            return false;
        }
        public async Task<IEnumerable<ProformaInvoiceDtl>> UpdateProformaInvoiceDtl(IEnumerable<ProformaInvoiceDtl> proformaInvoiceDtls, int mstId)
        {
            var targetedProMstDtls = await _nmsDataContext.ProformaInvoiceDtls.Where(x => x.MstId == mstId).ToListAsync();
            foreach (var v in targetedProMstDtls)
            {
                _nmsDataContext.Remove(v);
                await _nmsDataContext.SaveChangesAsync();
            }

            if (proformaInvoiceDtls.Count() > 0)
            {
                foreach (var v in proformaInvoiceDtls)
                {
                    await _nmsDataContext.ProformaInvoiceDtls.AddAsync(v);
                    await _nmsDataContext.SaveChangesAsync();
                }
            }
            var proDtls = await GetProformaDtlsByProformaMst(mstId);
            return proDtls;
        }
        public async Task<SubmissionResult> IsProformaSubmitted(int mstId)
        {
            SubmissionResult submissionResult = new SubmissionResult();
            var proMst = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == mstId);
            if (proMst.Confirmation == true && proMst.SubmissionDate != null)
            {
                submissionResult.IsSubmitted = true;
            }
            else
            {
                submissionResult.IsSubmitted = false;
            }
            return submissionResult;
        }

        public async Task<ProformaInvoiceMst> SubmitProformaInvoice(int proMstId)
        {
            var proMst = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == proMstId);
            proMst.Confirmation = true;
            proMst.SubmissionDate = DateTime.Now;
            _nmsDataContext.Attach(proMst);
            await _nmsDataContext.SaveChangesAsync();
            return proMst;
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetAllProformaInvoiceMst()
        {
            var proformaMsts = await _nmsDataContext.ProformaInvoiceMsts.ToListAsync();
            return proformaMsts;
        }

        public async Task<bool> IsProformaInvoiceNoExist(string proformaInvoiceNo)
        {
            if (await _nmsDataContext.ProformaInvoiceMsts.AnyAsync(x => x.ProformaInvoiceNo == proformaInvoiceNo))
                return false;
            return true;
        }
        public async Task<ProformaInvoiceMstReportDto> ProformaInvoiceMstReport(int mstId)
        {
            var proMstRep = await (from mst in _nmsDataContext.ProformaInvoiceMsts
                                   join imp in _nmsDataContext.ImporterInfos on mst.ImporterId equals imp.Id
                                   where (mst.Id == mstId)
                                   select new ProformaInvoiceMstReportDto
                                   {
                                       Id = mst.Id,
                                       ApplicationNo = mst.ApplicationNo,
                                       ProformaInvoiceNo = mst.ProformaInvoiceNo,
                                       ProformaDate = mst.ProformaDate,
                                       SubmissionDate = mst.SubmissionDate,
                                       CountryOfOrigin = mst.CountryOfOrigin,
                                       Currency = mst.Currency,
                                       PortOfLoading = mst.PortOfLoading,
                                       PortOfEntry = mst.PortOfEntry,
                                       Confirmation = mst.Confirmation,
                                       ImporterId = mst.ImporterId,
                                       OrgName = imp.OrgName,
                                       Address = imp.Address
                                   }).FirstOrDefaultAsync();
            return proMstRep;
        }
        public async Task<IEnumerable<AnnReqProdDtlsForProforDto>> GetAnnReqProdDtlsByImp(int importerId)
        {
            //int year = DateTime.Now.Year;
            //DateTime firstDay = new DateTime(year, 1, 1);
            //DateTime lastDay = new DateTime(year, 12, 31);
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
            var prodDtls = await (from d in _nmsDataContext.AnnualRequirementDtls
                                  join m in _nmsDataContext.AnnualRequirementMsts on d.AnnReqMstId equals m.Id
                                  where (m.ImporterId == importerId && m.Confirmation==true && m.SubmissionDate >= firstDay && m.SubmissionDate <= lastDate)
                                  select new AnnReqProdDtlsForProforDto
                                  {
                                      ProductId = d.Id,
                                      ProdName = d.ProdName,
                                      ProdType = d.ProdType,
                                      HsCode = d.HsCode,
                                      Manufacturer = d.Manufacturer,
                                      PackSize = d.PackSize,
                                      Country = d.CountryOfOrigin,
                                      TentativeUnits = d.TentativeUnits,
                                      TotalAmount = d.TotalAmount
                                  }).ToListAsync();
            foreach (var p in prodDtls)
            {
                if(p.TotalAmount>0)
                {
                    var remAmt = await GetRemainingAnnReqProductAmt(importerId, p.ProductId, p.ProdName, p.PackSize, p.TotalAmount);
                    p.RemainingAmount = remAmt;
                }
                else if (p.TentativeUnits > 0)
                {
                    var remAmt = await GetRemainingAnnReqProductUnit(importerId, p.ProductId, p.ProdName, p.PackSize, p.TentativeUnits);
                    p.RemainingAmount = remAmt;
                }
            }
            return prodDtls;
        }
        //new start
        public async Task<IEnumerable<AnnReqProdDtlsForProforDto>> GetAnnReqProdDtlsByImpEditMode(int importerId, string prodName,string packSize, string hsCode)
        {
            //int year = DateTime.Now.Year;
            //DateTime firstDay = new DateTime(year, 1, 1);
            //DateTime lastDay = new DateTime(year, 12, 31);
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
            var prodDtls = await (from d in _nmsDataContext.AnnualRequirementDtls
                                  join m in _nmsDataContext.AnnualRequirementMsts on d.AnnReqMstId equals m.Id
                                  where (m.ImporterId == importerId  && d.ProdName==prodName && d.PackSize==packSize && d.HsCode== hsCode
                                  && m.SubmissionDate >= firstDay && m.SubmissionDate <= lastDate)
                                  select new AnnReqProdDtlsForProforDto
                                  {
                                      ProductId = d.Id,
                                      ProdName = d.ProdName,
                                      ProdType = d.ProdType,
                                      HsCode = d.HsCode,
                                      PackSize = d.PackSize,
                                      TentativeUnits = d.TentativeUnits,
                                      TotalAmount = d.TotalAmount
                                  }).ToListAsync();
            foreach (var p in prodDtls)
            {
                if (p.TotalAmount > 0)
                {
                    var remAmt = await GetRemainingAnnReqProductAmt(importerId, p.ProductId, p.ProdName, p.PackSize, p.TotalAmount);
                    p.RemainingAmount = remAmt;
                }
                else if (p.TentativeUnits > 0)
                {
                    var remAmt = await GetRemainingAnnReqProductUnit(importerId, p.ProductId, p.ProdName, p.PackSize, p.TentativeUnits);
                    p.RemainingAmount = remAmt;
                }
            }
            return prodDtls;
        }
        //new end
        public async Task<double?> GetRemainingAnnReqProductUnit(int importerId, int productId, string prodName, string packSize, double? totUnit)
        {
            ProfInvTotalAmtDtoByProdDto profInvTotalAmtDtoByProdDto = new ProfInvTotalAmtDtoByProdDto
            {
                ImporterId = importerId,
                ProdName = prodName,
                PackSize= packSize,
                TentitiveUnit = totUnit
            };
            PiTentitiveUnitValidationDto piTentitiveUnitValidationDto = await GetCrntYearTentitiveProformaInvUnitByProd(profInvTotalAmtDtoByProdDto);
            return piTentitiveUnitValidationDto.RemainingAmount;
        }
        public async Task<double?> GetRemainingAnnReqProductAmt(int importerId, int productId, string prodName, string packSize, double? totAmt)
        {
            ProfInvTotalAmtDtoByProdDto profInvTotalAmtDtoByProdDto = new ProfInvTotalAmtDtoByProdDto
            {
                ImporterId = importerId,
                ProdName = prodName,
                PackSize = packSize,
                TotalAmount = totAmt
            };
            PiTotalAmountValidationDto piTotalAmountValidationDto = await GetCrntYearTotlProformaInvAmtByProd(profInvTotalAmtDtoByProdDto);
            return piTotalAmountValidationDto.RemainingAmount;
        }

        public async Task<ProformaInvoiceMst> GetProfromaInvoiceMstById(int id)
        {
            var proMst = await _nmsDataContext.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == id);
            return proMst;
        }
    }
}
