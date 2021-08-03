using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NMS_API.Dtos.ProformaApprovalDtos;
using NMS_API.Models;

namespace NMS_API.Services.Interfaces
{
    public interface IProformaInvoiceApprovalRepository
    {
        Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseSubmittedProformaInvoice(ProformaApprovalDateRangeDto dateRangeDto);
        Task<IEnumerable<ProformaInvoiceMst>> GetAllPendingPorformaInvoices();
        Task<ProformaInvoiceDtl> ApproveProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl, int userId);
        Task<ProformaInvoiceDtl> RejectProformaInvoice(ProformaInvoiceDtl proformaInvoiceDtl, int userId);
        //Ashiq created
        Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseApprovalProformaInvoice(ProformaApprovalDateRangeForNocDto dateRangeDto);
    }
}
