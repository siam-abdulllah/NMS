using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using NMS_API.Dtos.ImporterInfoDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Exporting
{
    public class ImporterExcelExporter : EpPlusExcelExporterBase, IImporterExcelExporter
    {
        public ImporterExcelExporter(
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
        }

        public FileDto ExportToFile(List<GetImporterForViewDto> impoters)
        {
            return CreateExcelPackage(
                "Impoters.xlsx",
                excelPackage =>
                {
                    var sheet = excelPackage.Workbook.Worksheets.Add("Impoters");
                    sheet.OutLineApplyStyle = true;

                    AddHeader(
                        sheet,
                        "OrgName",
                        "ContactName",
                        "Username",
                        "Position",
                        "ContactNo",
                        "Email",
                        "Division",
                        "District",
                        "Upazila",
                        "Address",
                        "DlsLicenseType",
                        "DlsLicenseNo",
                        "NidNo"
                       
                        );
                    AddObjects(
                                    sheet, 2, impoters,
                                    _ => _.OrgName,
                                    _ => _.ContactName,
                                    _ => _.Username,
                                    _ => _.Position,
                                    _ => _.ContactNo,
                                    _ => _.Email,
                                    _ => _.Division,
                                    _ => _.District,
                                    _ => _.Upazila,
                                    _ => _.Address,
                                    _ => _.DlsLicenseType,
                                    _ => _.DlsLicenseNo,
                                    _ => _.NidNo
                                    );

                    var sendDateTimeColumn = sheet.Column(4);
                    sendDateTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";
                    sendDateTimeColumn.AutoFit();
                    var readDateTimeColumn = sheet.Column(7);
                    readDateTimeColumn.Style.Numberformat.Format = "yyyy-mm-dd";
                    readDateTimeColumn.AutoFit();


                });
        }
    }
}
