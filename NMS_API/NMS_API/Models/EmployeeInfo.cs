using Abp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class EmployeeInfo : Entity<int>
    {
       // public int Id { get; set; }
        public string EmpCode { get; set; }
        public string EmpName { get; set; }
        public string Designation { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public UserLogin UserLogin { get; set; }

    }
}
