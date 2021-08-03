using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.ProformaInvoiceReportDtos;
using NMS_API.Dtos.ReportDto;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Repositories
{
    public class ProformaReportRepository : IProformaReportRepository
    {
        private readonly NmsDataContext _context;
        public ProformaReportRepository(NmsDataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetCurrentYearProformaInfo()
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
            var proformaInv = await _context.ProformaInvoiceMsts
           .Include(x => x.ImporterInfo)
           .Include(x => x.ProformaInvoiceDtls)
           .Where(x => x.SubmissionDate > firstDay && x.SubmissionDate <= lastDate)
           .OrderBy(x => x.ImporterInfo.ContactName)
           // .OrderByDescending(x => x.SubmissionDate)
           // .OrderByDescending(x => x.ProformaInvoiceNo)
           .ToListAsync();
            return proformaInv;
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseProformaByImporter(ProformaInvoiceSearchDto searchDto)
        {
            try
            {
                DateTime beforeFiveDate = DateTime.Now.AddDays(-5);
                searchDto.FromDate = searchDto.FromDate.Date;
                searchDto.ToDate = searchDto.ToDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                IEnumerable<ProformaInvoiceMst> proformaInv = null;
                if (string.IsNullOrEmpty(searchDto.Status))
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ImporterId == searchDto.ImporterId)
                   //.OrderBy(x => x.ImporterInfo.ContactName)
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }

                else if (searchDto.Status == "pending")
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ImporterId == searchDto.ImporterId && ((x.ApprovalDate >= beforeFiveDate) || x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == null)))
                   //.OrderBy(x => x.ImporterInfo.ContactName)
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else if (searchDto.Status == "rejected")
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ApprovalDate < beforeFiveDate && x.ImporterId == searchDto.ImporterId && x.ProformaInvoiceDtls.All(y => y.ApprovalStatus == false))
                   //.OrderBy(x => x.ImporterInfo.ContactName)
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ApprovalStatus == true && x.ApprovalDate < beforeFiveDate && x.ImporterId == searchDto.ImporterId && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == true))
                   //.OrderBy(x => x.ImporterInfo.ContactName)
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseProformaInfos(AllProformaInvoiceSearchDto searchDto)
        {
            try
            {
                searchDto.FromDate = searchDto.FromDate.Date;
                searchDto.ToDate = searchDto.ToDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                IEnumerable<ProformaInvoiceMst> proformaInv = null;
                if (string.IsNullOrEmpty(searchDto.Status))
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate
                        && x.ProformaInvoiceDtls.Any(y => y.ProdType.Contains(searchDto.searchText) || y.ProdName.Contains(searchDto.searchText)))
                   .OrderBy(x => x.ImporterInfo.ContactName)
                   //.OrderByDescending(x => x.SubmissionDate)
                   //.OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else if (searchDto.Status == "pending")
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == null)
                    && x.ProformaInvoiceDtls.Any(y => y.ProdType.Contains(searchDto.searchText) || y.ProdName.Contains(searchDto.searchText)))
                   .OrderBy(x => x.ImporterInfo.ContactName)
                   //.OrderByDescending(x => x.SubmissionDate)
                   //.OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else if (searchDto.Status == "rejected")
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ProformaInvoiceDtls.All(y => y.ApprovalStatus == false)
                    && x.ProformaInvoiceDtls.Any(y => y.ProdType.Contains(searchDto.searchText) || y.ProdName.Contains(searchDto.searchText)))
                   .OrderBy(x => x.ImporterInfo.ContactName)
                   //.OrderByDescending(x => x.SubmissionDate)
                   //.OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else if (searchDto.Status == "approved/rejected")
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ProformaInvoiceDtls.All(y => y.ApprovalStatus != null)
                    && x.ProformaInvoiceDtls.Any(y => y.ProdType.Contains(searchDto.searchText) || y.ProdName.Contains(searchDto.searchText)))
                   .OrderBy(x => x.ImporterInfo.ContactName)
                   //.OrderByDescending(x => x.SubmissionDate)
                   //.OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
                else
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > searchDto.FromDate && x.SubmissionDate <= searchDto.ToDate && x.ApprovalStatus == true && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == true)
                    && x.ProformaInvoiceDtls.Any(y => y.ProdType.Contains(searchDto.searchText) || y.ProdName.Contains(searchDto.searchText)))
                   .OrderBy(x => x.ImporterInfo.ContactName)
                   //.OrderByDescending(x => x.SubmissionDate)
                   //.OrderByDescending(x => x.ProformaInvoiceNo)
                   .ToListAsync();
                    return proformaInv;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<IEnumerable<ProformaInvoiceMst>> GetImporterWiseCurrentYearProforma(int importerId)
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
            var proformaInv = await _context.ProformaInvoiceMsts
                  .Include(x => x.ImporterInfo)
                  .Include(x => x.ProformaInvoiceDtls)
                  .Where(x => x.SubmissionDate >= firstDay && x.SubmissionDate <= lastDate && x.ImporterId == importerId)
                  //.OrderBy(x => x.ImporterInfo.ContactName)
                  .OrderByDescending(x => x.SubmissionDate)
                  .OrderByDescending(x => x.ProformaInvoiceNo)
                  .ToListAsync();
            return proformaInv;
        }

    }
}
