using Abp.Application.Services.Dto;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.ProformaApprovalDtos
{
    public class ApprovalProformaInvoiceForNocCertificateDto
    {
        public int Id { get; set; }
        public string ProformaInvoiceNo { get; set; }
        public string LetterNo { get; set; }
        public int ImporterId { get; set; }
        public string ImporterName { get; set; }
        public string  ImporterAddress { get; set; }
        public DateTime? SubmissionDate { get; set; }
        public string CountryOfOrigin { get; set; }
        //public string ProdName { get; set; }
        //public string ProdType { get; set; }
        //public string PackSize { get; set; }
        //public double? ApprovedAmount { get; set; }
        public IListResult<ProformaInvoiceDtl> ProformaInvoiceDtls { get; set; }
    }
}
