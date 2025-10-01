// 登录
async function login() {
    const username = document.getElementById("username").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();

    if (!username || !phoneNumber) {
        alert("请输入姓名和手机号！");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/getExcelData");
        const responseData = await fetch("http://localhost:3000/getExcelData2");
        const disease = await response.json();  // 二维数组
        const data = await responseData.json();  // 二维数组


        if (disease.length > 0) {
            const randomIndex = Math.floor(Math.random() * disease.length);
            const randomRow = disease[randomIndex];
            const patientId = randomRow[2];
            const patientData = data.filter(row => row[1] === patientId);

            // 调试日志
            console.log("读取的缓存:", patientData);

            alert("欢迎进入！");

            // 保存输入的姓名和手机号
            localStorage.setItem("inputInfo", JSON.stringify({ username, phoneNumber }));
            localStorage.setItem("loggedInIndex", randomIndex);  // 保存当前 index
            localStorage.setItem("loggedInUser", JSON.stringify(randomRow));
            localStorage.setItem("patientData", JSON.stringify(patientData));  // 保存患者数据

            window.location.href = "public/dashboard.html"; // 跳转到基本信息页面
        }
        else {
            alert("数据为空，无法登录！");
        }
    }
    catch (error) {
        console.error("登录失败：", error);
        alert("登录时发生错误，请检查网络或稍后重试！");
    }
}

// 基本信息
function dashboard() {
    window.location.href = "dashboard.html";
}

// 医疗咨询
function chat() {
    window.location.href = "chat.html";
}

// 血压记录
function records() {
    window.location.href = "records.html";
}

async function nextpage() {
    const currentIndex = parseInt(localStorage.getItem("loggedInIndex"));
    try {
        const nextIndex = currentIndex + 1;
        const response = await fetch(`http://localhost:3000/getRowByIndex?index=${nextIndex}`);
        if (!response.ok) throw new Error("无数据或服务器错误");

        const nextRow = await response.json();

        // 保存并跳转
        localStorage.setItem("loggedInIndex", nextIndex);
        localStorage.setItem("loggedInUser", JSON.stringify(nextRow));

        window.location.href = "dashboard.html";
    } catch (error) {
        alert("已经是最后一位病人或发生错误！");
        console.error("获取下一位病人失败：", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const cachedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const cachedData = JSON.parse(localStorage.getItem("patientData"));
    // 调试日志
    console.log("当前用户信息:", cachedUser);
    console.log("当前用户数据:", cachedData);
    console.log(Array.isArray(cachedUser));
    console.log(Array.isArray(cachedData));

    if (!cachedUser) {
        //alert("无法获取用户信息，请重新登录！");
        window.location.href = "./index.html";
        return;
    }

    updatePatientInfo(cachedUser);
    try {
        const currentPage = window.location.pathname.split("/").pop();
        switch (currentPage) {
            case "dashboard.html":
                updatedashboard(cachedUser);
                break;
            case "records.html":
                loadExcelData(cachedData);
                break;
            default:
                console.log("无页面匹配逻辑，不执行任何初始化函数");
                break;
        }
    } catch (error) {
        console.error("更新用户信息失败：", error);
        alert("用户数据异常，请重新登录！");
        window.location.href = "../index.html";
    }
});


// 更新患者侧边栏基本信息
function updatePatientInfo(firstRow) {
    if (!Array.isArray(firstRow)) {
        throw new Error("用户数据格式无效！");
    }

    const setText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    // 更新患者基本信息（仅在有这些元素的页面生效）
    setText(".patient-info h2", firstRow[1]);
    setText(".patient-info p:nth-child(2)", `身份证号：`);
    setText(".patient-info p:nth-child(3)", `住院号：${firstRow[2]}`);
    setText(".patient-info p:nth-child(4)", `CARDNO：${firstRow[4]}`);
    setText(".patient-info p:nth-child(5)", `性别：`);
    setText(".patient-info p:nth-child(6)", `年龄：${firstRow[10]}`);
    setText(".patient-info p:nth-child(7)", `身高：${firstRow[11]}`);
    setText(".patient-info p:nth-child(8)", `是否住院：${firstRow[3]}`);
}


// dashboard 信息更新
function updatedashboard(firstRow) {
    document.querySelectorAll(".vital-signs .data-group").forEach(group => {
        const label = group.querySelector(".infomation")?.textContent.trim();
        const value = group.querySelector(".data");
        if (!value) return;
        switch (label) {
            case "血压":
                value.textContent = firstRow[15];
                break;
            case "孕周":
                value.textContent = firstRow[14];
                break;
            case "孕次":
                value.textContent = firstRow[16];
                break;
            case "产次":
                value.textContent = firstRow[17];
                break;

            case "入院诊断":
                value.textContent = firstRow[5];
                break;
            case "出院诊断":
                value.textContent = firstRow[6];
                break;
            case "孕前体重":
                value.textContent = firstRow[12];
                break;
            case "入院体重":
                value.textContent = firstRow[13];
                break;

            case "婴儿性别":
                value.textContent = firstRow[9];
                break;
            case "胎儿体重":
                value.textContent = firstRow[19];
                break;
            case "胎儿身长":
                value.textContent = firstRow[8];
                break;
            case "分娩方式":
                value.textContent = firstRow[20];
                break;
            default:
                break;
        }
    });
    //updatedata(firstRow[23]);
}


// 处理患者信息数据
function updatedata(datastring) {
    const rawText = datastring;

    // 在句号和数字序号后面加换行符 \n
    const formattedText = rawText
        .replace(/(?<!^)(\d+[、])/g, '\n$1');   // 在 1. 2. 3. 等前面加换行

    document.querySelector(".data p:nth-child(1)").textContent = formattedText;
}


async function loadExcelData(patientData) {
    try {
        // 获取 <thead> 中的所有列标题
        const headerCells = document.querySelectorAll('.data-table-container .data-table thead th');
        const header = Array.from(headerCells).map(th => th.textContent.trim());
        // 第二步：找到 <tbody>
        const tbody = document.querySelector('.data-table-container .data-table tbody');
        tbody.innerHTML = '';  // 清空旧内容
        const startIndex = header.indexOf("检查日期");  // 假设从这里开始展示

        // 第三步：添加每一行数据
        patientData.forEach(row => {
            const tr = document.createElement('tr');
            const displayRow = row.slice(startIndex);

            // 遍历 header（从 startIndex 开始的字段数），补全缺失列
            for (let i = 0; i < header.length - startIndex; i++) {
                if (i == 1) continue; // 跳过第二列（住院号）

                const cell = displayRow[i];
                const td = document.createElement('td');

                if (cell === null || cell === undefined || cell === '') {
                    td.textContent = '--'; // 缺省显示 --
                } else {
                    td.textContent = cell;

                    // 异常标记 ↑ 或 ↓ 添加样式
                    if (typeof cell === 'string' && (cell.includes('↑') || cell.includes('↓'))) {
                        td.classList.add('abnormal');
                    }
                }

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('加载 Excel 数据失败', error);
    }
}

// 退出登录时清除缓存，未使用
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("dataArray");
    window.location.href = "../login.html";
}