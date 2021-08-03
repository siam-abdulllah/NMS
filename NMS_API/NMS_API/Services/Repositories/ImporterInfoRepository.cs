using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.ImporterInfoDtos;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using NMS_API.Services.Exporting;
using NMS_API.Dtos.ProformaDtos;
using NMS_API.Models;

namespace NMS_API.Services.Repositories
{
    public class ImporterInfoRepository : IImporterInfoRepository
    {
        private readonly NmsDataContext _context;
        private readonly IImporterExcelExporter _importerExcel;
        public ImporterInfoRepository(NmsDataContext context, IImporterExcelExporter importerExcel)
        {
            _context = context;
            _importerExcel = importerExcel;
        }

        public async Task<PagedResultDto<GetImporterForViewDto>> GetAllImporterInfos(GetAllInputFilter input)
        {
            try
            {
                var importerInfo = (from ul in _context.UserLogins
                                    join im in _context.ImporterInfos on ul.Id equals im.UserId
                                    where (im.OrgName == input.Filter) || im.ContactName.Contains(input.Filter) || im.ContactNo.Contains(input.Filter)
                                    || im.Email.Contains(input.Filter) || ul.Username.Contains(input.Filter)
                                    || im.Position.Contains(input.Filter) || im.Division.Contains(input.Filter)
                                    || im.District.Contains(input.Filter) || im.Upazila.Contains(input.Filter)
                                    || im.DlsLicenseNo.Contains(input.Filter) || im.NidNo.Contains(input.Filter)

                                    select new GetImporterForViewDto
                                    {
                                        Id = im.Id,
                                        UserId = ul.Id,
                                        Username = ul.Username,
                                        OrgName = im.OrgName,
                                        ContactName = im.ContactName,
                                        ContactNo = im.ContactNo,
                                        Position = im.Position,
                                        Email = im.Email,
                                        Division = im.Division,
                                        District = im.District,
                                        Upazila = im.Upazila,
                                        Address = im.Address,
                                        DlsLicenseType = im.DlsLicenseType,
                                        DlsLicenseNo = im.DlsLicenseNo,
                                        DlsLicenseScan = im.DlsLicenseScan,
                                        NidNo = im.NidNo,
                                        NidScan = im.NidScan,
                                        IrcScan = im.IrcScan,
                                        ImpCode = im.ImpCode

                                    });

                var totalCount = await importerInfo.CountAsync();

                var results = await importerInfo
                    .OrderBy(input.Sorting ?? "e => e.Id desc")
                    .PageBy(input)
                    .ToListAsync();

                return new PagedResultDto<GetImporterForViewDto>(
                  totalCount,
                  results
                  );
            }
            catch(Exception e)
            {
                throw e;
            }
            
        }

        public async Task<PagedResultDto<GetImporterForViewDto>> GetAllImporterInfosPdf()
        {
            var importerInfo = (from ul in _context.UserLogins
                                join im in _context.ImporterInfos on ul.Id equals im.UserId
                               
                                select new GetImporterForViewDto
                                {
                                    Id = im.Id,
                                    UserId = ul.Id,
                                    Username = ul.Username,
                                    OrgName = im.OrgName,
                                    ContactName = im.ContactName,
                                    ContactNo = im.ContactNo,
                                    Position = im.Position,
                                    Email = im.Email,
                                    Division = im.Division,
                                    District = im.District,
                                    Upazila = im.Upazila,
                                    Address = im.Address,
                                    DlsLicenseType = im.DlsLicenseType,
                                    DlsLicenseNo = im.DlsLicenseNo,
                                    DlsLicenseScan = im.DlsLicenseScan,
                                    NidNo = im.NidNo,
                                    NidScan = im.NidScan,
                                    IrcScan = im.IrcScan,
                                    ImpCode = im.ImpCode

                                });

            var totalCount = await importerInfo.CountAsync();

            var results = await importerInfo.ToListAsync();

            return new PagedResultDto<GetImporterForViewDto>(
              totalCount,
              results
              );
        }

        public async Task<ImporterInfo> GetImporterInfoById(int importerId)
        {
            var importer = await _context.ImporterInfos
                .Include(x => x.UserLogin)
                .FirstOrDefaultAsync(x => x.Id == importerId);
            return importer;
        }
        public async Task<ImporterInfo> DeleteImporter(int importerId)
        {
            var importer = await _context.ImporterInfos.FirstOrDefaultAsync(e => e.Id == importerId);
            var user = await _context.UserLogins.FirstOrDefaultAsync(x => x.Id == importer.UserId);
            var userRoleConfs = await _context.UserRoleConfs.FirstOrDefaultAsync(x => x.UserId == importer.UserId);

            _context.ImporterInfos.Remove(importer);
            _context.UserLogins.Remove(user);
            _context.UserRoleConfs.Remove(userRoleConfs);
            await _context.SaveChangesAsync();
            return importer;
        }

        public async Task<FileDto> GetImportersToExcel()
        {
            var importerInfo = (from ul in _context.UserLogins
                                join im in _context.ImporterInfos on ul.Id equals im.UserId
                               
                                select new GetImporterForViewDto
                                {
                                    Id = im.Id,
                                    UserId = ul.Id,
                                    Username = ul.Username,
                                    OrgName = im.OrgName,
                                    ContactName = im.ContactName,
                                    ContactNo = im.ContactNo,
                                    Position = im.Position,
                                    Email = im.Email,
                                    Division = im.Division,
                                    District = im.District,
                                    Upazila = im.Upazila,
                                    Address = im.Address,
                                    DlsLicenseType = im.DlsLicenseType,
                                    DlsLicenseNo = im.DlsLicenseNo,
                                    DlsLicenseScan = im.DlsLicenseScan,
                                    NidNo = im.NidNo,
                                    NidScan = im.NidScan,
                                    IrcScan = im.IrcScan,
                                    ImpCode = im.ImpCode

                                });


            var results = await importerInfo.ToListAsync();

            return _importerExcel.ExportToFile(results);
        }
      
    }
}
