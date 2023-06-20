//즉시 실행
$(function(){
	$(".datepicker, .start_date, .end_date").datepicker({
			showOn:"both",
			buttonImage:"/asset/images/datepicker/btn_datepicker.png",
			buttonImageOnly:true,
			dateFormat: 'yy-mm-dd',
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNames: ['일','월','화','수','목','금','토'],
			dayNamesShort: ['일','월','화','수','목','금','토'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			showMonthAfterYear: true,
			yearSuffix: '년',
			changeMonth: true,
			changeYear: true
	});

	$(document).find('form').attr('autocomplete', 'off');
    
	// jquery appendVal plugin
	$.fn.appendVal = function (newPart) {
		var result = this.each(function(){ 
			if( null != $(this).val() && "" != $(this).val() ){
				$(this).val( $(this).val() +","+ newPart );
			}else{
				$(this).val( $(this).val() + newPart); 
			}
		});
		return result;
	};
});

//에디터 전역 변수
var oEditors = [];

/** 네이버 에디터 추가 * */
function addEditor(id, fnc) {
	nhn.husky.EZCreator.createInIFrame({
		oAppRef : oEditors,
		elPlaceHolder : id,
		sSkinURI : "/SE_2.8.2.patch/SmartEditor2Skin.html",
		htParams : {
			bUseToolbar : true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseVerticalResizer : true, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지
			// 않음)
			bUseModeChanger : true, // 모드 탭(Editor | HTML | TEXT) 사용 여부
			// (true:사용/ false:사용하지 않음)
			fOnBeforeUnload : function() {
			},
			aAdditionalFontList : []
		}, // boolean
		fOnAppLoad : function() {
			// oEditors.getById[id].setDefaultFont('kopubM', 10) ;
			if (fnc) {
				fnc();
			}
		},
		fCreator : "createSEditor2"
	});
}

/** 네이버 에디터에서 값을 가져온다. * */
function getHTML(id) {
	//return sHTML = oEditors.getById[id].exec("UPDATE_CONTENTS_FIELD", []);
	return sHTML = oEditors.getById[id].getIR();
	
}
function setHTML(id, HTML) {
	oEditors.getById[id].exec("PASTE_HTML", [ HTML ]);
}
/** XSS 치환 return **/
function fnStripTag(str){  
	str = str.replace(/<[^<|>]*>|&nbsp;|\r\n/gi, "").trim();
	return str;
}


/* 공통페이징함수 */
var fnPaging = function(pageIndex) {
	var $frm = $("#pageIndex").parent("form");
	$("#pageIndex").val(pageIndex);
	$frm.submit();
};
var fnPagingLnk = function(pageIndex, _url) {
	var $frm = $("#pageIndex").parent("form");
	$("#pageIndex").val(pageIndex);
	$frm.attr("action", _url);
	$frm.submit();
};

// searchForm 페이지 이동 공통 함수
var fnGoUrlForm = function(_url) {
	var $frm = $("form[name=searchForm]");
	$frm.attr("action",  _url);    
    $frm.submit();
};


// 게시글 카테고리 검색
var fnSearchArticleCateUrl = function(cateCd, url){			
	var $frm = $("form[name=searchForm]");
	$frm.find("input[name=pageIndex]").val(1);
	$frm.find("input[name=searchCateCd]").val(cateCd);
	$frm.attr("action", url);
	$frm.submit();
};	

// 게시글 상세 화면 이동
var fnArticleViewUrl = function(atcIdx, url){			
	var $frm = $("form[name=searchForm]");
	$frm.prepend("<input type='hidden' name='atcIdx' id='atcIdx' value='" + atcIdx + "' />");
	$frm.attr("action", url);
	$frm.submit();
};	

//이미지 로딩 체크 
var fnImagesLoaded = function() {
	var isLoaded = true;
	var images = document.images;

	for (var i = 0 ; i<images.length ; i++)		{
		if(images[i].complete == false) {
			isLoaded = false;
		}
	}
	return isLoaded;
};

// 공통 > 이미지 상세보기 레이어 팝업 호출
var fnGetImageView = function(filePath){
	var fnApplyCallback = function(res){
		$("#modal-default .modal-content").html(res);
	};
	$.ajax({
		type: "get",
		url:"/cmmn/imageAjaxView.do",
		data: {
			'filePath': filePath
		}, 
		dataType: 'html',
        cache:true,
		async:true, 				
		success: fnApplyCallback,
		complete: function() {		
			setModalSize();
		},
		error: function (e) {
		}
	});	
	
	var setModalSize = function() {
		if ( !fnImagesLoaded() ) { setTimeout(function(){ setModalSize() }, 500); return; }
		var imageWidth = $('.modal-body #detailImage').width() + 30;
		if ( imageWidth == 30 ) {  setTimeout(function(){ setModalSize() }, 500); return; }
		if ( imageWidth > 600 ) $('.modal-dialog').width( imageWidth );
	};
};

// 비밀번호 Validation 강도 표시
var fnPasswdValidSign = function(pwdObj, idObj){
	var $targetObj = $("#passwordValidSign");
	var userId = idObj.val();
	var pwdChk = pwdObj.value.isPasswd(userId);
	$targetObj.removeClass();
	
	if ( pwdChk < 0 ) {		
		$targetObj.addClass('int-pass fc01');
		$targetObj.text('약함');
	}
	if ( pwdChk >= 0 && pwdChk < 10 ) {		
		$targetObj.addClass('int-pass fc02');
		$targetObj.text('적절');
	}	
	if ( pwdChk >= 10 ) {		
		$targetObj.addClass('int-pass fc03');
		$targetObj.text('안전');
	}		
};

// 파일 삭제 
var fnFileDel = function(obj){
	$(obj).parent().remove();
};



//*************************************************************
//쿠키 생성
//*************************************************************
function fnSetCookie(name, value, expiredays)
{
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

//*************************************************************
//쿠키 불러오기
//*************************************************************
function fnGetCookie(Name){
    var search = Name + "="
    if (document.cookie.length > 0) {  //  쿠키가  설정되어  있다면
        offset = document.cookie.indexOf(search)
        if (offset != -1) {  //  쿠키가  존재하면
            offset += search.length
            //  set  index  of  beginning  of  value
            end = document.cookie.indexOf(";", offset)
            //  쿠키 값의  마지막  위치  인덱스  번호  설정
            if (end == -1)
                end = document.cookie.length
            return unescape(document.cookie.substring(offset, end))
        }
    }
    return "";
}

//############ 로그인 여부 확인 ################################
var isLoginLnk = (function(lnkUrl){		
	if(isLogin == false){		
		if( ! confirm("로그인이 필요한 서비스 입니다.\n로그인 페이지로 이동하시겠습니까?") ) 	return false;
		location.href = '/login/login.do?menuIdx=137&returnUrl=' + escape(lnkUrl);
		return false;
	}else{
		if ( isBlank(lnkUrl) == false) location.href = lnkUrl;		
		return true;
	}
});


// ############# 공통 코드 Json 목록 select박스 셋팅 ################
var fnSetSelectCodeJsonList = function(_obj, _grpCd, _selectedCd){
	var $obj = _obj;
	$obj.children("option[value!='']").remove();	
	
	var fnApplyCallback = function(res){
		if ( res.resultCode != '0005' ) {
			alert(res.resultMsg);
			return false;
		}
		var codeList = res.resultData.codeList;	
		$(codeList).each(function(idx, result){
			$obj.append('<option value="' + result.cd + '">' + result.nm + '</option>');										
		});	
		if ( _selectedCd.notNull() ) $obj.val(_selectedCd);
	}			
	$.ajax({
		type: "get",
		url:"/cmmn/codeJsonList.do",
		data: {
			"grpCd" : _grpCd
		},
		dataType: 'json',
        cache:false,
		async:false,
		success: fnApplyCallback,
		error: function (e) {
		}
	});	 			
};	

// 공통 팝업 닫기
var fnCmmnPopClose = function(_idx) {
	var $obj = $("#outbackCmmnPop_" + _idx);
	if ( $obj.find("input:checkbox[name=today_" + _idx + "]").is(":checked") ) {
		fnSetCookie('outbackCmmnPop_' + _idx, 'outbackCmmnPop_' + _idx + '_cookie', 1);
	}
	if ( $obj.find("input:checkbox[name=forever_" + _idx + "]").is(":checked") ) {
		fnSetCookie('outbackCmmnPop_' + _idx, 'outbackCmmnPop_' + _idx + '_cookie', -1);
	}
	$obj.remove();
}
function isBlank(_str){
	var str	= $.trim(_str);		
	if (str == null || str == ""){
		return true;
	}else{
		return false;
	}
};

//############팝업 열기################################
function popWin(url, w, h, scroll, name) {
	var option = "status=no,height=" + h + ",width=" + w + ",resizable=no,left=0,top=0,screenX=0,screenY=0,scrollbars=" + scroll;

	commonPopWin = window.open(url, name, option);
	commonPopWin.focus();
}

function popWinForm(frm, url, w, h, scroll, name) {
	var frm	= frm;
	frm.action = url;
	frm.target = "sendWin";
	var option = "status=no,height=" + h + ",width=" + w + ",resizable=no,left=0,top=0,screenX=0,screenY=0,scrollbars=" + scroll;

	commonPopWin = window.open('', frm.target, option);
	commonPopWin.focus();
	frm.submit();
}	

function confirmPopWin(url, w, h, scroll, name){
	if (confirm("새 창으로 열립니다. 여시겠습니까?") == false)	return;

	var option = "status=no,height=" + h + ",width=" + w + ",resizable=no,left=0,top=0,screenX=0,screenY=0,scrollbars=" + scroll;

	commonPopWin = window.open(url, name, option);
	commonPopWin.focus();
}
function confirmTargetLocation(url){
	if (confirm("새 창으로 열립니다. 여시겠습니까?") == false)	return;
	var popWin = window.open('about:blank');
	popWin.location.href = url;
}
function targetLocation(url){
	var popWin = window.open('about:blank');
	popWin.location.href = url;
}

function dateSelect(docForm, selectIndex, selectedDay) {
	watch = new Date(docForm.selectYear.options[docForm.selectYear.selectedIndex].text, docForm.selectMonth.options[docForm.selectMonth.selectedIndex].value,1);
	hourDiffer = watch - 86400000;
	calendar = new Date(hourDiffer);

	var daysInMonth = calendar.getDate();
	for (var i = 0; i < docForm.selectDay.length; i++) {
		docForm.selectDay.options[0] = null;
	}
	for (var i = 0; i < daysInMonth; i++) {
		var dayVal = i+1;
		if( dayVal < 10 ){
			dayVal = '0'+dayVal;
		}
		docForm.selectDay.options[i] = new Option(dayVal);
	}
	docForm.selectDay.options[0].selected = true;
	if( selectedDay != '' ){
		for(var i=0; i<docForm.selectDay.options.length; i++){
		    if( docForm.selectDay.options[i].value == selectedDay ){
		    	docForm.selectDay.options[i].selected = true;
			    break;
		    }
		}
	}
}

function startDateSelect(docForm, selectIndex, selectedDay) {
	watch = new Date(docForm.start_year.options[docForm.start_year.selectedIndex].text, docForm.start_month.options[docForm.start_month.selectedIndex].value,1);
	hourDiffer = watch - 86400000;
	calendar = new Date(hourDiffer);

	var daysInMonth = calendar.getDate();
	for (var i = 0; i < docForm.start_day.length; i++) {
		docForm.start_day.options[0] = null;
	}
	for (var i = 0; i < daysInMonth; i++) {
		var dayVal = i+1;
		if( dayVal < 10 ){
			dayVal = '0'+dayVal;
		}
		docForm.start_day.options[i] = new Option(dayVal);
	}
	docForm.start_day.options[0].selected = true;
	if( selectedDay != '' ){
		for(var i=0; i<docForm.start_day.options.length; i++){
		    if( docForm.start_day.options[i].value == selectedDay ){
		    	docForm.start_day.options[i].selected = true;
			    break;
		    }
		}
	}
}

function endDateSelect(docForm, selectIndex, selectedDay) {
	watch = new Date(docForm.end_year.options[docForm.end_year.selectedIndex].text, docForm.end_month.options[docForm.end_month.selectedIndex].value,1);
	hourDiffer = watch - 86400000;
	calendar = new Date(hourDiffer);
	
	var daysInMonth = calendar.getDate();
	for (var i = 0; i < docForm.end_day.length; i++) {
		docForm.end_day.options[0] = null;
	}
	for (var i = 0; i < daysInMonth; i++) {
		var dayVal = i+1;
		if( dayVal < 10 ){
			dayVal = '0'+dayVal;
		}
		docForm.end_day.options[i] = new Option(dayVal);
	}
	docForm.end_day.options[0].selected = true;
	if( selectedDay != '' ){
		for(var i=0; i<docForm.end_day.options.length; i++){
			if( docForm.end_day.options[i].value == selectedDay ){
				docForm.end_day.options[i].selected = true;
				break;
			}
		}
	}
}