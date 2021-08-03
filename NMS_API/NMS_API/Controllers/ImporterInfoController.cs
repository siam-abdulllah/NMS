using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ImporterInfoDtos;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;
using NMS_API.Services.Exporting;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImporterInfoController : ControllerBase
    {
        private readonly IImporterInfoRepository _importerInfoRepository;

        public ImporterInfoController(IImporterInfoRepository importerInfoRepository)
        {
            _importerInfoRepository = importerInfoRepository;
        }

        // GET: api/GetAllImporterInfos
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("GetAllImporterInfos")]
        public async Task<PagedResultDto<GetImporterForViewDto>> GetAllImporterInfos(GetAllInputFilter input)
        {

            var result = await _importerInfoRepository.GetAllImporterInfos(input);
            return result;

        }
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("GetImporterInfoById")]
        public async Task<ImporterInfo> GetImporterInfoById(ImporterIdDto importerIdDto)
        {
            var importer = await _importerInfoRepository.GetImporterInfoById(importerIdDto.ImporterId);
            return importer;
        }
        // DELETE: api/DeleteCurrencyRate/5
        [Authorize(Roles = "Admin,SA")]
        [HttpDelete("DeleteImporter/{id}")]
        public async Task<ActionResult<ImporterInfo>> DeleteImporter(int id)
        {
            var importer = await _importerInfoRepository.DeleteImporter(id);
            return importer;
        }

        [HttpGet("GetAllImporterInfosPdf")]
        public async Task<PagedResultDto<GetImporterForViewDto>> GetAllImporterInfosPdf()
        {

            var result = await _importerInfoRepository.GetAllImporterInfosPdf();
            return result;

        }

        [HttpGet("GetImportersToExcel")]
        public async Task<FileDto> GetImportersToExcel()
        {
            var result = await _importerInfoRepository.GetImportersToExcel();
            return result;
        }
        [HttpGet("DownloadFile/{fileName}")]
        //async Task<FileStream>
        public FileStream DownloadPiFile(string fileName)
        {
            try
            {
                var currentDirectory = Directory.GetCurrentDirectory();
                currentDirectory = currentDirectory + "\\Resources\\ImporterInfoDoc";
                var file = Path.Combine(Path.Combine(currentDirectory), fileName);
                return new FileStream(file, FileMode.Open, FileAccess.Read);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}