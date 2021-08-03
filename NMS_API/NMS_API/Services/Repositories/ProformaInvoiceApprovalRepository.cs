using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.ProformaApprovalDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Services.Repositories
{
    public class ProformaInvoiceApprovalRepository : IProformaInvoiceApprovalRepository
    {
        private readonly NmsDataContext _context;
        public ProformaInvoiceApprovalRepository(NmsDataContext context)
        {
            _context = context;
        }



        public async Task<IEnumerable<ProformaInvoiceMst>> GetAllPendingPorformaInvoices()
        {
            try
            {
                var proformaInv = await _context.ProformaInvoiceMsts
                    .Include(x => x.ImporterInfo)
                    .Include(x => x.ProformaInvoiceDtls)
                    .Where(x => x.Confirmation == true && x.SubmissionDate != null)
                    .OrderByDescending(x => x.SubmissionDate)
                    .OrderByDescending(x => x.ProformaInvoiceNo).Take(500)
                    .ToListAsync();
                return proformaInv;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseSubmittedProformaInvoice(ProformaApprovalDateRangeDto dateRangeDto)
        {
            try
            {
                dateRangeDto.FromDate = dateRangeDto.FromDate.Date;
                dateRangeDto.ToDate = dateRangeDto.ToDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                IEnumerable<ProformaInvoiceMst> proformaInv = null;
                if (dateRangeDto.IsPending == true)
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > dateRangeDto.FromDate && x.SubmissionDate <= dateRangeDto.ToDate && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == null))
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .OrderBy(x => x.ImporterInfo.OrgName)
                   .ToListAsync();
                    return proformaInv;
                }
                else
                {
                    proformaInv = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > dateRangeDto.FromDate && x.SubmissionDate <= dateRangeDto.ToDate)
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo)
                   .OrderBy(x => x.ImporterInfo.OrgName)
                   .ToListAsync();
                    return proformaInv;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseApprovalProformaInvoice(ProformaApprovalDateRangeForNocDto dateRangeDto)
        {
            try
            {
                dateRangeDto.FromDate = dateRangeDto.FromDate.Date;
                dateRangeDto.ToDate = dateRangeDto.ToDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                var proformaInvoice = await _context.ProformaInvoiceMsts
                   .Include(x => x.ImporterInfo)
                   .Include(x => x.ProformaInvoiceDtls)
                   .Where(x => x.SubmissionDate > dateRangeDto.FromDate && x.SubmissionDate <= dateRangeDto.ToDate && x.ApprovalStatus == true
                   )
                   .OrderByDescending(x => x.SubmissionDate)
                   .OrderByDescending(x => x.ProformaInvoiceNo).ToListAsync();

                var result = new List<ProformaInvoiceMst>();

                foreach (var item in proformaInvoice)
                {
                    var child = item.ProformaInvoiceDtls.Where(x => x.ApprovalStatus.HasValue && x.ApprovalStatus.Value).ToList();
                    if (child.Count > 0)
                    {
                        item.ProformaInvoiceDtls = child;
                        result.Add(item);
                    }

                }
                return result
                    .OrderByDescending(x => x.SubmissionDate)
                    .OrderByDescending(x => x.ProformaInvoiceNo);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ProformaInvoiceDtl> ApproveProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl, int userId)
        {
            var mst = await _context.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == proformaInvoiceDtl.MstId);
            mst.ApprovalDate = DateTime.Now;
            mst.ApprovalStatus = true;
            _context.ProformaInvoiceMsts.Attach(mst);
            var res = await _context.SaveChangesAsync() > 0;
            var prod = await _context.ProformaInvoiceDtls.FirstOrDefaultAsync(x => x.Id == proformaInvoiceDtl.Id && x.MstId == proformaInvoiceDtl.MstId);
            if (res)
            {
                prod.ApprovedAmount = proformaInvoiceDtl.ApprovedAmount;
                prod.ApprovalStatus = true;
                prod.ApprovedBy = userId;
                prod.Remarks = proformaInvoiceDtl.Remarks;
                _context.ProformaInvoiceDtls.Attach(prod);
                await _context.SaveChangesAsync();
            }
            return prod;
        }
        public async Task<ProformaInvoiceDtl> RejectProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl, int userId)
        {
            var mst = await _context.ProformaInvoiceMsts.FirstOrDefaultAsync(x => x.Id == proformaInvoiceDtl.MstId);
            mst.ApprovalDate = DateTime.Now;
            mst.ApprovalStatus = true;
            _context.ProformaInvoiceMsts.Attach(mst);
            var res = await _context.SaveChangesAsync() > 0;
            var prod = await _context.ProformaInvoiceDtls.FirstOrDefaultAsync(x => x.Id == proformaInvoiceDtl.Id && x.MstId == proformaInvoiceDtl.MstId);
            if (res)
            {
                prod.ApprovalStatus = false;
                prod.ApprovedAmount = 0;
                prod.ApprovedBy = userId;
                prod.Remarks = proformaInvoiceDtl.Remarks;
                _context.ProformaInvoiceDtls.Attach(prod);
                await _context.SaveChangesAsync();
            }
            return prod;
        }

    }
}
