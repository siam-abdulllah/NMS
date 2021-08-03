using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.CommonDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.UserRoleConfDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using NMS_API.Dtos.RoleInfoDtos;

namespace NMS_API.Services.Repositories
{
    public class UserRoleConfRepository : IUserRoleConfRepository
    {
        private readonly NmsDataContext _context;
        public UserRoleConfRepository(NmsDataContext context)
        {
            _context = context;
        }
        public async Task<PagedResultDto<GetUserRoleConfForViewDto>> GetAllUserRoleConfs(GetAllInputFilter input)
        {
            var userRole = (from ur in _context.UserRoleConfs
                            join em in _context.EmployeeInfos on ur.UserId equals em.UserId
                            join r in _context.RoleInfos on ur.RoleId equals r.Id
                            where r.Name.Contains(input.Filter) || em.EmpName.Contains(input.Filter)

                            select new GetUserRoleConfForViewDto
                            {
                                Id = ur.Id,
                                UserId=em.UserId,
                                RoleId=r.Id,
                                UserName=em.EmpName,
                                RoleName=r.Name
                            });
            var totalCount = await userRole.CountAsync();

            var results = await userRole
                .OrderBy(input.Sorting ?? "e => e.Id desc")
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<GetUserRoleConfForViewDto>(
                totalCount,
                results
                );
        }

        public async Task<GetUserRoleConfForViewDto> GetUserRoleConf(int id)
        {
            var userRole =await (from ur in _context.UserRoleConfs
                            join em in _context.EmployeeInfos on ur.UserId equals em.UserId
                            join r in _context.RoleInfos on ur.RoleId equals r.Id
                            where ur.Id==id

                            select new GetUserRoleConfForViewDto
                            {
                                Id = ur.Id,
                                UserId = em.UserId,
                                RoleId = r.Id,
                                UserName = em.EmpName,
                                RoleName = r.Name
                            }).FirstOrDefaultAsync();
            return userRole;
        }
        public async Task<UserRoleConf> CreateUserRoleConf(GetUserRoleConfForEditOutput createUserRoleDto)
        {
            UserRoleConf userRole = new UserRoleConf
            {
               UserId= createUserRoleDto.UserId,
               RoleId=createUserRoleDto.RoleId
            };
            await _context.UserRoleConfs.AddAsync(userRole);
            await _context.SaveChangesAsync();
            return userRole;
        }

        public async Task<GetUserRoleConfForViewDto> EditUserRoleConf(int id, GetUserRoleConfForEditOutput editOutput)
        {
            UserRoleConf userRole = await _context.UserRoleConfs.FirstOrDefaultAsync(i => i.Id == id);
            if (userRole != null)
            {
                userRole.UserId = editOutput.UserId;
                userRole.RoleId = editOutput.RoleId;
            }
            _context.UserRoleConfs.Update(userRole);
            await _context.SaveChangesAsync();
            var updatedRoleInfo = await GetUserRoleConf(userRole.Id);
            return updatedRoleInfo;
        }

        public async Task<UserRoleConf> DeleteUserRoleConf(int id)
        {
            var userRoleInfo = await _context.UserRoleConfs.FirstOrDefaultAsync(e => e.Id == id);
            _context.UserRoleConfs.Remove(userRoleInfo);
            await _context.SaveChangesAsync();
            return userRoleInfo;
        }

        public async Task<bool> IsUserRoleConfExists(int id)
        {
            if (await _context.UserRoleConfs.AnyAsync(x => x.Id == id))
                return false;
            return true;
        }

        public async Task<bool> IsUserRoleUserIdRoleIdExists(int userId, int roleId)
        {
            if (await _context.UserRoleConfs.AnyAsync(x => x.UserId == userId && x.RoleId==roleId))
                return false;
            return true;
        }
        public async Task<bool> IsUserRoleUserIdExists(int userId)
        {
            if (await _context.UserRoleConfs.AnyAsync(x => x.UserId == userId))
                return false;
            return true;
        }

        public async Task<PagedResultDto<LookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = (from r in _context.EmployeeInfos
                        where r.EmpName.Contains(input.Filter)

                        select new GetEmployeeForViewDto
                        {
                            UserId = r.UserId,
                            EmpName = r.EmpName
                        });

            var totalCount = await query.CountAsync();

            var empList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<LookupTableDto>();
            foreach (var emp in empList)
            {
                lookupTableDtoList.Add(new LookupTableDto
                {
                    Id = emp.UserId,
                    DisplayName = emp.EmpName?.ToString()
                });
            }

            return new PagedResultDto<LookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        public async Task<PagedResultDto<LookupTableForAssignRoleDto>> GetAllRoleForLookupTable(GetAllForLookupTableInput input)
        {
            var query = (from r in _context.RoleInfos
                         where (r.Name.Contains(input.Filter) || r.FullName.Contains(input.Filter)) && r.Name != "Importer" && r.Name != "importer"

                         select new GetRoleForViewDto
                                {
                                    Id = r.Id,
                                    Name = r.Name,
                                    FullName = r.FullName
                                });
            // .Where(
            //    !string.IsNullOrWhiteSpace(input.Filter),
            //   e => e.Name.ToString().Contains(input.Filter)
            //);

            var totalCount = await query.CountAsync();

            var roleList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<LookupTableForAssignRoleDto>();
            foreach (var role in roleList)
            {
                lookupTableDtoList.Add(new LookupTableForAssignRoleDto
                {
                    Id = role.Id,
                    DisplayName = role.Name?.ToString(),
                    FullName = role.FullName?.ToString()
                });
            }

            return new PagedResultDto<LookupTableForAssignRoleDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}
