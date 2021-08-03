using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.RoleInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleInfoController : ControllerBase
    {
        private readonly IRoleInfoRepository _roleInfoRepository;

        public RoleInfoController(IRoleInfoRepository roleInfoRepository)
        {
            _roleInfoRepository = roleInfoRepository;
        }

        // GET: api/GetAllRoleInfos
        [Authorize(Roles = "SA")]
        [HttpPost("GetAllRoleInfos")]
        public async Task<PagedResultDto<GetRoleForViewDto>> GetAllRoleInfos(GetAllInputFilter input)
        {
            var result = await _roleInfoRepository.GetAllRoleInfos(input);
            return result;
        }

        // GET: api/GetRoleInfo/5
        [Authorize(Roles = "SA")]
        [HttpGet("GetRoleInfo/{id}")]
        public async Task<ActionResult<GetRoleForViewDto>> GetRoleInfo(int id)
        {
            var roleInfo = await _roleInfoRepository.GetRoleInfo(id);

            if (roleInfo == null)
            {
                return NotFound();
            }

            return roleInfo;
        }

        // POST: api/RoleInfo
        [Authorize(Roles = "SA")]
        [HttpPost("CreateRoleInfo")]
        public async Task<ActionResult<RoleInfo>> CreateRoleInfo(CreateRoleDto createRoleDto)
        {
            if (createRoleDto.Name.ToLower() == "importer")
            {
                return BadRequest("Invalid Role");
            }
            var res = await _roleInfoRepository.IsRoleExists(createRoleDto.Name);
            if (!res)
            {
                return BadRequest("Role already exist");
            }
            var createrole = await _roleInfoRepository.CreateRoleInfo(createRoleDto);
            return createrole;
        }

        // PUT: api/EditRoleInfo/5
        [Authorize(Roles = "SA")]
        [HttpPut("EditRoleInfo/{id}")]
        public async Task<ActionResult<GetRoleForViewDto>> EditRoleInfo(int id, GetRoleForEditOutput editOutput)
        {
            if (editOutput.Name.ToLower() == "importer")
            {
                return BadRequest("Invalid Role");
            }
            var res = await _roleInfoRepository.IsRoleExists(editOutput.Name);
            if (!res)
            {
                return BadRequest("Role already exist");
            }

            var roleInfo = await _roleInfoRepository.EditRoleInfo(id, editOutput);

            return roleInfo;
        }

        // DELETE: api/RoleInfo/5
        [Authorize(Roles = "SA")]
        [HttpDelete("DeleteRoleInfo/{id}")]
        public async Task<ActionResult<RoleInfo>> DeleteRoleInfo(int id)
        {
            var roleInfo = await _roleInfoRepository.DeleteRoleInfo(id);
            return roleInfo;
        }
    }
}