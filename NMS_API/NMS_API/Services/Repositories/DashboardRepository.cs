using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.DashboardDtos;
using NMS_API.Services.Interfaces;

namespace NMS_API.Services.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly NmsDataContext _context;
        public DashboardRepository(NmsDataContext context)
        {
            _context = context;
        }
        public async Task<ImporterDashboardDto> GetImporterDashboardInfo(int importerId)
        {
            DateTime beforeFiveDate = DateTime.Now.AddDays(-5);
            var proformaInvByImporter = await _context.ProformaInvoiceMsts.Where(x => x.Confirmation == true && x.SubmissionDate != null && x.ImporterId == importerId).ToListAsync();
            var totalProforma = proformaInvByImporter.Count();
            var rejectedProducts = await (from d in _context.ProformaInvoiceDtls
                                          join m in _context.ProformaInvoiceMsts on d.MstId equals m.Id
                                          where (m.ImporterId == importerId && d.ApprovalStatus == false && m.ApprovalDate < beforeFiveDate)
                                          select new
                                          {
                                              m.ProformaInvoiceNo,
                                              m.ApplicationNo,
                                              d.ProdName
                                          }).ToListAsync();
            var totalRejectedProduct = rejectedProducts.Count();
            var approvedProforma = await _context.ProformaInvoiceMsts.Where(x => x.ApprovalStatus == true && x.ApprovalDate < beforeFiveDate && x.ImporterId == importerId && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == true)).ToArrayAsync();
            var totalApprovedProforma = approvedProforma.Count();
            var percentageOfProformaApproval = (totalApprovedProforma * 100) / totalProforma;
            var pendingProformaApproval = await (from d in _context.ProformaInvoiceDtls
                                                 join m in _context.ProformaInvoiceMsts on d.MstId equals m.Id
                                                 where (m.ImporterId == importerId && d.ApprovalStatus == null)
                                                 select new
                                                 {
                                                     m.ProformaInvoiceNo,
                                                     m.ApplicationNo,
                                                     d.ProdName
                                                 }).ToListAsync();
            var totalPendinProformaApproval = pendingProformaApproval.Count();

            var dashboard = new ImporterDashboardDto
            {
                ApprovedProforma = totalApprovedProforma,
                TotalProforma = totalProforma,
                RejectedProduct = totalRejectedProduct,
                PendingProformaApproval = totalPendinProformaApproval
            };
            return dashboard;
        }
        public async Task<AdminDashboardDto> GetAdminDashboardInfo()
        {
            var proformaInv = await _context.ProformaInvoiceMsts.Where(x => x.Confirmation == true && x.SubmissionDate != null).ToListAsync();
            var totalProformaInv = proformaInv.Count();
            var rejectedProforma = _context.ProformaInvoiceMsts
                .Include(x => x.ProformaInvoiceDtls).Where(x => x.Confirmation == true && x.SubmissionDate != null && x.ApprovalStatus != null && x.ProformaInvoiceDtls.All(y => y.ApprovalStatus == false));
            
            var totalRejectedProduct = rejectedProforma.Count();
            var approvedProforma = await _context.ProformaInvoiceMsts.Where(x => x.ApprovalStatus == true && x.ProformaInvoiceDtls.All(y => y.ApprovalStatus == true)).ToArrayAsync();
            var totalApprovedProforma = approvedProforma.Count();
            var percentageOfProformaApproval = (totalApprovedProforma * 100) / totalProformaInv;
            var pendingProformaApproval = await _context.ProformaInvoiceMsts
                .Include(x => x.ProformaInvoiceDtls)
                .Where(x => x.SubmissionDate != null && x.Confirmation == true && x.ProformaInvoiceDtls.Any(y => y.ApprovalStatus == null)).ToListAsync();
            
            var totalPendinProformaApproval = pendingProformaApproval.Count();
            var totalPartialApprovedProforma = totalProformaInv - (totalApprovedProforma + totalRejectedProduct + totalPendinProformaApproval);
            var importers = await _context.ImporterInfos.ToListAsync();
            var totalImporters = importers.Count();
            var employees = await _context.EmployeeInfos.ToListAsync();
            var totalEmployees = employees.Count();
            var dashboard = new AdminDashboardDto
            {
                ApprovedProforma = totalApprovedProforma,
                TotalProforma = totalProformaInv,
                RejectedProforma = totalRejectedProduct,
                PendingProformaApproval = totalPendinProformaApproval,
                PartialApprovedProforma = totalPartialApprovedProforma,
                TotalImporter = totalImporters,
                TotalEmployee = totalEmployees
            };
            return dashboard;
        }
    }
}
