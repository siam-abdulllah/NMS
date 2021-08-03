using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NMS_API.Migrations
{
    public partial class CurrencyClassaddedAshiq : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnnualRequirementMsts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AnnualReqNo = table.Column<string>(nullable: true),
                    ImporterId = table.Column<int>(nullable: false),
                    SubmissionDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnnualRequirementMsts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CurrencyRates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Currency = table.Column<string>(maxLength: 128, nullable: false),
                    TickerIcon = table.Column<string>(nullable: true),
                    ExchangeRate = table.Column<double>(nullable: false),
                    CreatorUserId = table.Column<int>(nullable: true),
                    CreationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<int>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrencyRates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EmpCode = table.Column<string>(nullable: true),
                    EmpName = table.Column<string>(nullable: true),
                    Designation = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    ContactNo = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeInfos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImporterInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    OrgName = table.Column<string>(nullable: true),
                    ContactName = table.Column<string>(nullable: true),
                    Position = table.Column<string>(nullable: true),
                    ContactNo = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Division = table.Column<string>(nullable: true),
                    District = table.Column<string>(nullable: true),
                    Upazila = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    DlsLicenseType = table.Column<string>(nullable: true),
                    DlsLicenseNo = table.Column<string>(nullable: true),
                    DlsLicenseScan = table.Column<string>(nullable: true),
                    NidNo = table.Column<string>(nullable: true),
                    NidScan = table.Column<string>(nullable: true),
                    IrcScan = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    ImpCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImporterInfos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleInfos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<byte[]>(nullable: true),
                    PasswordSalt = table.Column<byte[]>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    CreatedTerminal = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedTerminal = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    UserType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoleConfs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoleConfs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AnnualRequirementDtls",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AnnReqMstId = table.Column<int>(nullable: false),
                    ProdName = table.Column<string>(nullable: true),
                    ProdType = table.Column<string>(nullable: true),
                    HsCode = table.Column<string>(nullable: true),
                    Manufacturer = table.Column<string>(nullable: true),
                    CountryOfOrigin = table.Column<string>(nullable: true),
                    PackSize = table.Column<string>(nullable: true),
                    Currency = table.Column<string>(nullable: true),
                    TotalAmount = table.Column<double>(nullable: false),
                    TentativeUnits = table.Column<int>(nullable: false),
                    UnitPrice = table.Column<double>(nullable: false),
                    ExchangeRate = table.Column<double>(nullable: false),
                    TotalPrice = table.Column<double>(nullable: false),
                    TotalPriceInBdt = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnnualRequirementDtls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnnualRequirementDtls_AnnualRequirementMsts_AnnReqMstId",
                        column: x => x.AnnReqMstId,
                        principalTable: "AnnualRequirementMsts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProformaInvoiceMsts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ApplicationNo = table.Column<string>(nullable: true),
                    ProformaInvoiceNo = table.Column<string>(nullable: true),
                    ProformaDate = table.Column<DateTime>(nullable: false),
                    SubmissionDate = table.Column<DateTime>(nullable: true),
                    CountryOfOrigin = table.Column<string>(nullable: true),
                    Currency = table.Column<string>(nullable: true),
                    PortOfLoading = table.Column<string>(nullable: true),
                    PortOfEntry = table.Column<string>(nullable: true),
                    PiScan = table.Column<string>(nullable: true),
                    LitScan = table.Column<string>(nullable: true),
                    TestReport = table.Column<string>(nullable: true),
                    OtherDoc = table.Column<string>(nullable: true),
                    Confirmation = table.Column<bool>(nullable: false),
                    ApprovalDate = table.Column<DateTime>(nullable: true),
                    ApprovalStatus = table.Column<bool>(nullable: true),
                    ImporterId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProformaInvoiceMsts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProformaInvoiceMsts_ImporterInfos_ImporterId",
                        column: x => x.ImporterId,
                        principalTable: "ImporterInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProformaInvoiceDtls",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MstId = table.Column<int>(nullable: false),
                    ProdName = table.Column<string>(nullable: true),
                    ProdType = table.Column<string>(nullable: true),
                    HsCode = table.Column<string>(nullable: true),
                    Manufacturer = table.Column<string>(nullable: true),
                    PackSize = table.Column<string>(nullable: true),
                    NoOfUnits = table.Column<int>(nullable: false),
                    UnitPrice = table.Column<double>(nullable: false),
                    TotalAmount = table.Column<double>(nullable: false),
                    ExchangeRate = table.Column<double>(nullable: false),
                    TotalPrice = table.Column<double>(nullable: false),
                    TotalPriceInBdt = table.Column<double>(nullable: false),
                    ApprovalStatus = table.Column<bool>(nullable: true),
                    ApprovedBy = table.Column<int>(nullable: false),
                    Remarks = table.Column<string>(nullable: true),
                    ApprovedAmount = table.Column<double>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProformaInvoiceDtls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProformaInvoiceDtls_ProformaInvoiceMsts_MstId",
                        column: x => x.MstId,
                        principalTable: "ProformaInvoiceMsts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnnualRequirementDtls_AnnReqMstId",
                table: "AnnualRequirementDtls",
                column: "AnnReqMstId");

            migrationBuilder.CreateIndex(
                name: "IX_ProformaInvoiceDtls_MstId",
                table: "ProformaInvoiceDtls",
                column: "MstId");

            migrationBuilder.CreateIndex(
                name: "IX_ProformaInvoiceMsts_ImporterId",
                table: "ProformaInvoiceMsts",
                column: "ImporterId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnnualRequirementDtls");

            migrationBuilder.DropTable(
                name: "CurrencyRates");

            migrationBuilder.DropTable(
                name: "EmployeeInfos");

            migrationBuilder.DropTable(
                name: "ProformaInvoiceDtls");

            migrationBuilder.DropTable(
                name: "RoleInfos");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoleConfs");

            migrationBuilder.DropTable(
                name: "AnnualRequirementMsts");

            migrationBuilder.DropTable(
                name: "ProformaInvoiceMsts");

            migrationBuilder.DropTable(
                name: "ImporterInfos");
        }
    }
}
