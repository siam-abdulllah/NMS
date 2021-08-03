using NMS_API.Dtos.ImporterInfoDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Exporting
{
    public interface IImporterExcelExporter
    {
        FileDto ExportToFile(List<GetImporterForViewDto> impoters);
    }
}
