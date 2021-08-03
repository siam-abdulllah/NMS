using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IProformaInvoiceRepository
    {
        Task<PiTotalAmountValidationDto> GetCrntYearTotlProformaInvAmtByProd(ProfInvTotalAmtDtoByProdDto profInvTotalAmtDtoByProdDto);
        Task<ProformaInvoiceMst> SaveProformaInvoiceMst(ProformaInvoiceMst proformaInvoiceMst);
        Task<IEnumerable<ProformaInvoiceDtl>> SaveProformaInvoiceDtl(IEnumerable<ProformaInvoiceDtl> proformaInvoiceDtl);
        Task<ProformaInvoiceMst> UpdateProformaFilePath(int id, string[] Arr);
        Task<ProformaInvoiceMst> UpdatePiFilePath(int mstId, string[] Arr);
        Task<ProformaInvoiceMst> UpdateLitFilePath(int mstId, string[] Arr);
        Task<ProformaInvoiceMst> UpdateTestFilePath(int mstId, string[] Arr);
        Task<ProformaInvoiceMst> UpdateOtherFilePath(int mstId, string[] Arr);
        Task<IEnumerable<ProformaInvoiceMst>> GetAllProformaInvoiceMstByUser(ImporterIdDto importerIdDto);
        Task<IEnumerable<ProformaInvoiceDtl>> GetProformaDtlsByProformaMst(int poMstId);
        Task<ProformaInvoiceMst> UpdateProformaInvoiceMst(ProformaInvoiceMstUpdateDto proformaInvoiceMstUpdateDto);
        Task<IEnumerable<ProformaInvoiceDtl>> UpdateProformaInvoiceDtl(IEnumerable<ProformaInvoiceDtl> proformaInvoiceDtls,int mstId);
        Task<bool> ValidateUpdateProMstClaim(int proMstId, int userId);
        Task<SubmissionResult> IsProformaSubmitted(int mstId);
        Task<ProformaInvoiceMst> SubmitProformaInvoice( int proMstId);
        Task<IEnumerable<ProformaInvoiceMst>> GetAllProformaInvoiceMst();
        Task<ProformaInvoiceMstReportDto> ProformaInvoiceMstReport(int mstId);
        Task<IEnumerable<AnnReqProdDtlsForProforDto>> GetAnnReqProdDtlsByImp(int importerId);
        Task<IEnumerable<AnnReqProdDtlsForProforDto>> GetAnnReqProdDtlsByImpEditMode(int importerId, string prodName, string packSize, string hsCode);
        Task<bool> IsProformaInvoiceNoExist(string proformaInvoiceNo);
        Task<ProformaInvoiceMst> GetProfromaInvoiceMstById(int id);
    }
}
