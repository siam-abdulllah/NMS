using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Auditing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Services.Exporting;

namespace NMS_API.Controllers.File
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public FileController(ITempFileCacheManager tempFileCacheManager)
        {
            _tempFileCacheManager = tempFileCacheManager;
        }

        [DisableAuditing]
        [HttpPost("DownloadTempFile")]
        public ActionResult DownloadTempFile(FileDto file)
        {
            var fileBytes = _tempFileCacheManager.GetFile(file.FileToken);
            if (fileBytes == null)
            {
                return NotFound("RequestedFileDoesNotExists");
            }

            return File(fileBytes, file.FileType, file.FileName);
        }
    }
}