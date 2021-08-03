using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.CommonDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.UserRoleConfDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleConfController : ControllerBase
    {
        private readonly IUserRoleConfRepository _userRoleConfRepository;
        public UserRoleConfController(IUserRoleConfRepository userRoleConfRepository)
        {
            _userRoleConfRepository = userRoleConfRepository;
        }

        // GET: api/GetAllRoleInfos
        [HttpPost("GetAllUserRoleConfs")]
        public async Task<PagedResultDto<GetUserRoleConfForViewDto>> GetAllUserRoleConfs(GetAllInputFilter input)
        {
            var result = await _userRoleConfRepository.GetAllUserRoleConfs(input);
            return result;
        }

        [HttpGet("GetUserRoleConf/{id}")]
        public async Task<ActionResult<GetUserRoleConfForViewDto>> GetUserRoleConf(int id)
        {
            var userRole = await _userRoleConfRepository.GetUserRoleConf(id);
            if(userRole==null)
            {
                return NotFound();
            }
            return userRole;
        }
  
        // POST: api/UserRoleConf
        [HttpPost("CreateUserRoleConf")]
        public async Task<ActionResult<UserRoleConf>> CreateUserRoleConf(GetUserRoleConfForEditOutput createUserRoleDto)
        {
            if (!await _userRoleConfRepository.IsUserRoleUserIdRoleIdExists(createUserRoleDto.UserId, createUserRoleDto.RoleId))
                return BadRequest("User is Already Exists");

            if (!await _userRoleConfRepository.IsUserRoleUserIdExists(createUserRoleDto.UserId))
                return BadRequest("User is Already Assign a Role");

            var result = await _userRoleConfRepository.CreateUserRoleConf(createUserRoleDto);
            return result;
        }

        [HttpPut("EditUserRoleConf/{id}")]
        public async Task<ActionResult<GetUserRoleConfForViewDto>> EditUserRoleConf(int id, GetUserRoleConfForEditOutput editOutput)
        {
            if (_userRoleConfRepository.IsUserRoleConfExists(id) == null)
            {
                return BadRequest();
            }

            var userRole = await _userRoleConfRepository.EditUserRoleConf(id, editOutput);

            return userRole;
        }

        // DELETE: api/RoleInfo/5
        [HttpDelete("DeleteUserRoleConf/{id}")]
        public async Task<ActionResult<UserRoleConf>> DeleteUserRoleConf(int id)
        {
            var userRoleInfo = await _userRoleConfRepository.DeleteUserRoleConf(id);
            return userRoleInfo;
        }

        // GET: api/GetAllRoleInfos
        [HttpPost("GetAllUserForLookupTable")]
        public async Task<PagedResultDto<LookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var result = await _userRoleConfRepository.GetAllUserForLookupTable(input);
            return result;
        }

        // GET: api/GetAllRoleInfos
        [HttpPost("GetAllRoleForLookupTable")]
        public async Task<PagedResultDto<LookupTableForAssignRoleDto>> GetAllRoleForLookupTable(GetAllForLookupTableInput input)
        {
            var result = await _userRoleConfRepository.GetAllRoleForLookupTable(input);
            return result;
        }

    }
}