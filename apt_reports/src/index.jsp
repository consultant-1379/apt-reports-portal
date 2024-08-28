<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>APT Reports</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="src/eds.min.css"/>
    <link rel="stylesheet" type="text/css" media="screen" href="src/app.css"/>
</head>

<body class="light">
    <%@page import="java.io.*" %>
    <%@page import="java.util.*" %>
    <%!        public void GetDirectory(String a_Path, ArrayList a_folders) {
            File l_Directory = new File(a_Path);
            File[] l_files = l_Directory.listFiles();
            ArrayList l_ignoreDirs = new ArrayList();
            l_ignoreDirs.add("service-jmxproxy");
            l_ignoreDirs.add("reports");
            l_ignoreDirs.add("reports_test");
            l_ignoreDirs.add("TestAPT-Delete");

            if(l_files != null){
                for (int c = 0; c < l_files.length; c++) {
                    if (l_files[c].isDirectory() && !l_ignoreDirs.contains(l_files[c].getName()) && !l_files[c].getName().startsWith(".")) {
                        a_folders.add(l_files[c].getName());
                    }
                }
            }

            Collections.sort(a_folders);
        }
    %>
<header class="sysbar">
    <div class="item">
        <i class="icon icon-econ"></i>
        <span class="product">ENM - APT Reports</span>
        <span class="acronym">EPN</span>
    </div>
</header>
<main>
    <aside class="settings hidden"></aside>
    <div class="app slide-right">
        <div class="appbody">
            <div class="appnav">
                <div class="tree navigation">
                    <ul>
                    <%
                        ArrayList l_Folders = new ArrayList();
                        String base_dir = "/proj/ENM_Jawas/";
                        GetDirectory(base_dir, l_Folders);

                        //List the servers APT reports are available for
                        for( int a=0 ; a<l_Folders.size() ; a++ ) {
                            String server_name = l_Folders.get(a).toString();
                    %>
                            <li><a href="?deployment_id=<%=server_name%>" class="item"><%=server_name%></a></li>
                    <%  }

                        if(request.getParameter("deployment_id") == null) {
                            request.setAttribute("deployment_id", l_Folders.get(0));
                        } else {
                            request.setAttribute("deployment_id", request.getParameter("deployment_id"));
                        }
                    %>
                    </ul>
                </div>
            </div>
            <div class="appcontent">
                <div class="row">
                    <div class="tile sm-12">
                        <div class="header">
                            <div class="left">
                                <div class="title">Reports available for the following dates on <%=request.getAttribute("deployment_id")%></div>
                            </div>
                        </div>
                        <div class="content">
                            <%
                                ArrayList l_dFolders = new ArrayList();
                                String server_name = request.getAttribute("deployment_id").toString();
                                GetDirectory(base_dir + server_name + "/", l_dFolders);
                            %>
                                    <div id="<%=server_name%>" class="date_link">
                                        <ul class="available_dates">
                            <%

                                    if (!l_dFolders.isEmpty()) {
                                        for( int b=l_dFolders.size()-1 ; b>=0 ; b-- ) {
                                            String date_folder = l_dFolders.get(b).toString();
                                            String frmt_date_fldr = "";
                                            if (date_folder.length() >14) {
                                                frmt_date_fldr = date_folder.substring(0,4) + "-" + date_folder.substring(4,6) + "-" + date_folder.substring(6,8) + " " + date_folder.substring(9,11) + ":" + date_folder.substring(11,13) + ":" + date_folder.substring(13,15);
                                            } else {
                                                frmt_date_fldr = date_folder;
                                            }
                            %>
                                            <li><a href="https://apt.lmera.ericsson.se/<%=server_name%>/<%=date_folder%>/report/index.html"><%=frmt_date_fldr%></a></li>
                            <%          }
                                    }
                            %>
                                        </ul>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<script src="src/eds.min.js" charset="utf-8"></script>
<script src="src/app.js" charset="utf-8"></script>
</body>

</html>