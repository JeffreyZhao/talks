using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WinDemo
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            this.lblStatus.Text = "Transfering";

            CSharp.Sync.Transfer(
                "http://127.0.0.1:8123/download?s=10",
                "http://127.0.0.1:8123/upload",
                (progress) =>
                {
                    this.pgsTransfering.Value = (int)progress;
                    this.lblStatus.Text = "Transfering " + progress + "%";
                },
                (length) =>
                {
                    this.pgsTransfering.Value = 100;
                    this.lblStatus.Text = "Complete, " + length + " bytes transfered";
                });

            /*
            CSharp.Async.Transfer(
                "http://127.0.0.1:8123/download?s=10",
                "http://127.0.0.1:8123/upload",
                (progress) =>
                {
                    this.Invoke(new Action(() =>
                    {
                        this.pgsTransfering.Value = (int)progress;
                        this.lblStatus.Text = "Transfering " + progress + "%";
                    }));
                },
                (length) =>
                {
                    this.Invoke(new Action(() =>
                    {
                        this.pgsTransfering.Value = 100;
                        this.lblStatus.Text = "Complete, " + length + " bytes transfered";
                    }));
                },
                (ex) => { });
             */

            /*
            CSharp2.Async.Transfer(
                "http://127.0.0.1:8123/download?s=10",
                "http://127.0.0.1:8123/upload",
                (progress) =>
                {
                    this.pgsTransfering.Value = (int)progress;
                    this.lblStatus.Text = "Transfering " + progress + "%";
                },
                (length) =>
                {
                    this.pgsTransfering.Value = 100;
                    this.lblStatus.Text = "Complete, " + length + " bytes transfered";
                },
                (ex) => { });
             */

            /*
            FSharp.Async.Transfer(
                "http://127.0.0.1:8123/download?s=10",
                "http://127.0.0.1:8123/upload",
                (progress) =>
                {
                    this.Invoke(new Action(() =>
                    {
                        this.pgsTransfering.Value = (int)progress;
                        this.lblStatus.Text = "Transfering " + progress + "%";
                    }));
                },
                (length) =>
                {
                    this.Invoke(new Action(() =>
                    {
                        this.pgsTransfering.Value = 100;
                        this.lblStatus.Text = "Complete, " + length + " bytes transfered";
                    }));
                },
                (ex) => { });
             */

            /*
            CSharp5.Async.Transfer(
                "http://127.0.0.1:8123/download?s=10",
                "http://127.0.0.1:8123/upload",
                (progress) =>
                {
                    this.pgsTransfering.Value = (int)progress;
                    this.lblStatus.Text = "Transfering " + progress + "%";
                },
                (length) =>
                {
                    this.pgsTransfering.Value = 100;
                    this.lblStatus.Text = "Complete, " + length + " bytes transfered";
                },
                (ex) => { });
             */
        }
    }
}
