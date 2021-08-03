using NMS_API.Data;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Repositories
{
    public class StudentRepository:IStudentRepository
    {
        private readonly NmsDataContext _nmsDbContext;
        public StudentRepository(NmsDataContext nmsDbContext)
        {
            _nmsDbContext = nmsDbContext;
        }

        public async Task<Student> Register(Student student)
        {
            await _nmsDbContext.Students.AddAsync(student);
            await _nmsDbContext.SaveChangesAsync();
            return student;
        }
    }
}
