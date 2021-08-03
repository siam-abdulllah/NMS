using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.RoleInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;

namespace NMS_API.Services.Repositories
{
    public class RoleInfoRepository : IRoleInfoRepository
    {
        private readonly NmsDataContext _context;

        public RoleInfoRepository(NmsDataContext context)
        {
            _context = context;
        }

        public async Task<RoleInfo> CreateRoleInfo(CreateRoleDto createRoleDto)
        {
            RoleInfo roleInfo = new RoleInfo
            {
                Name = createRoleDto.Name,
                FullName= createRoleDto.FullName
            };
            await _context.RoleInfos.AddAsync(roleInfo);
            await _context.SaveChangesAsync();
            return roleInfo;
        }

        public async Task<RoleInfo> DeleteRoleInfo(int id)
        {
            var roleInfo = await _context.RoleInfos.FirstOrDefaultAsync(e => e.Id == id);
            _context.RoleInfos.Remove(roleInfo);
            await _context.SaveChangesAsync();
            return roleInfo;
        }

        public async Task<GetRoleForViewDto> EditRoleInfo(int id, GetRoleForEditOutput editOutput)
        {
            RoleInfo roleInfo = await _context.RoleInfos.FirstOrDefaultAsync(i => i.Id == id);
            if (roleInfo != null)
            {
                roleInfo.Name = editOutput.Name;
                roleInfo.FullName = editOutput.FullName;

            }
            _context.RoleInfos.Update(roleInfo);
            await _context.SaveChangesAsync();
            var updatedRoleInfo = await GetRoleInfo(roleInfo.Id);
            return updatedRoleInfo;
        }

        public async Task<PagedResultDto<GetRoleForViewDto>> GetAllRoleInfos(GetAllInputFilter input)
        {
            var roleInfo = (from r in _context.RoleInfos
                                where r.Name.Contains(input.Filter) && r.Name !="Importer" && r.Name != "importer"

                            select new GetRoleForViewDto
                                {
                                    Id=r.Id,
                                    Name=r.Name,
                                    FullName = r.FullName                                    
                                });
            var totalCount = await roleInfo.CountAsync();

            var results = await roleInfo
                .OrderBy(input.Sorting ?? "e => e.Id desc")
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<GetRoleForViewDto>(
                totalCount,
                results
                );
        }

        //public async Task<PagedResultDto<GetRoleForViewDto>> GetAll()
        //{
        //    var roleInfo = (from r in _context.RoleInfos
        //                    select new GetRoleForViewDto
        //                    {
        //                        Id = r.Id,
        //                        Name = r.Name
        //                    });
        //    var totalCount = await roleInfo.CountAsync();
        //    var results = await roleInfo.ToListAsync();

        //    return new PagedResultDto<GetRoleForViewDto>(
        //         totalCount,
        //         results
        //         );
        //}

        public async Task<GetRoleForViewDto> GetRoleInfo(int id)
        {
            var roleInfo =await (from r in _context.RoleInfos
                            where (r.Id==id)

                            select new GetRoleForViewDto
                            {
                                Id = r.Id,
                                Name = r.Name,
                                FullName = r.FullName
                            }).FirstOrDefaultAsync();

            return roleInfo;
        }
        public async Task<bool> IsRoleExists(string name)
        {
            if (await _context.RoleInfos.AnyAsync(x => x.Name.ToLower() == name.ToLower()))
                return false;
            return true;
        }
        
    }
}
