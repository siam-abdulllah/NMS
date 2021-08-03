using Abp.Application.Services.Dto;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ImporterInfoDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using NMS_API.Services.Exporting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IImporterInfoRepository
    {
        Task<PagedResultDto<GetImporterForViewDto>> GetAllImporterInfos(GetAllInputFilter input);
        Task<FileDto> GetImportersToExcel();
        Task<PagedResultDto<GetImporterForViewDto>>GetAllImporterInfosPdf();
        Task<ImporterInfo> GetImporterInfoById(int importerId);
        Task<ImporterInfo> DeleteImporter(int importerId);
    }
}
