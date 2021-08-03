using NMS_API.Dtos.ProformaInvoiceReportDtos;
using NMS_API.Dtos.ReportDto;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IProformaReportRepository
    {
        Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseProformaByImporter(ProformaInvoiceSearchDto searchDto);
        Task<IEnumerable<ProformaInvoiceMst>> GetImporterWiseCurrentYearProforma(int importerId);
        Task<IEnumerable<ProformaInvoiceMst>> GetCurrentYearProformaInfo();
        Task<IEnumerable<ProformaInvoiceMst>> GetDateWiseProformaInfos(AllProformaInvoiceSearchDto searchDto);
    }
}
