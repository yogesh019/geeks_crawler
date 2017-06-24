var crawlGeeks = (function(){
	console.log("yogesh");
	var list_articles = [];
	var total_count = 0;
	var companyName = "";
	var categoryName = "";
	var categoryValue
	var search_ok = false;

	function raiseZeroResultsToast(e){
		Materialize.toast('Sorry, No results for this Search.',8000,'rounded')
	}

	function raiseInvalidSearch(e){
		Materialize.toast('Invalid Search!',10000,'rounded')
	}

	function raiseResultsTakingTimeToast(e){
		var toast_time = 20000;
		if(companyName=="Amazon"){
			toast_time = 350000
		}
		Materialize.toast('Compiling such a large list will take time. Be patient! :)', toast_time, 'rounded');
	}

	function raiseSelectOneArticle(e){
		Materialize.toast('Please select atleast one article. Thanks :)', 7000, 'rounded');
	}

	function removeLoader(e){
		existing_loader = document.getElementById('loader');
		if(existing_loader){
			existing_loader.parentNode.removeChild(existing_loader);
		}
	}

	function removeContentDiv(e){
		existing_content = document.getElementById('content-articles');
		if(existing_content){
			existing_content.parentNode.removeChild(existing_content);
		}
	}

	function removeTable(e){
		existing_table = document.getElementById('table_articles');
		if (existing_table) {
			existing_table.parentNode.removeChild(existing_table);
		}
	}

	function removeJoinButtons(e){
		existing_buttons = document.getElementById("join-buttons");
		if (existing_buttons) {
			existing_buttons.parentNode.removeChild(existing_buttons);
		}
	}

	function removePrintButton(e){
		existing_print_button = document.getElementById('print-btn');
		if(existing_print_button){
			existing_print_button.parentNode.removeChild(existing_print_button);
		}
	}

	function removeContentHeading(e){
		existing_heading = document.getElementById('content-heading');
		if(existing_heading){
			existing_heading.parentNode.removeChild(existing_heading);
		}
	}

	function removeFooter(e){
		existing_footer = document.getElementById('footer');
		if(existing_footer){
			existing_footer.parentNode.removeChild(existing_footer);
		}
	}

	function createFooter(e){
		removeFooter();
		footer = document.createElement('div')
		footer.id = "footer";
		footer.innerHTML = '<p>Developed and designed with <i class="fa fa-heart fa-1x"></i></p';	
		footer.style.backgroundColor = "rgba(231, 231, 231, 0.88)";
		footer.style.width = "90%";
		footer.style.marginRight = "5%"
		footer.style.position = "absolute";
		footer.style.bottom = "0";
		footer.style.textAlign = "center";
		document.body.appendChild(footer);
	}

	function createLoader(e){
		removeLoader();
		loader = document.createElement('div');
		loader.id = "loader";
		loader.innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		loader.style.marginLeft = "48%";
		loader.style.marginTop = "13%";
		loader.style.marginBottom = "5%";
		document.body.appendChild(loader);
	}

	function createTable(e){
		table = document.createElement('div');
		table.style.marginTop = "3%";
		table.id = "table_articles";
		ul_tag = document.createElement('ul');
		ul_tag.id = "articles";
		ul_tag.className = "collection";
		ul_tag.style.width = "85%";
		ul_tag.style.margin = "auto";

		table.appendChild(ul_tag);
		var ulKEli_html = ''
		var i=0;
		while (i<total_count){
			i = i+1;
			ulKEli_html = ulKEli_html + '<li class="collection-item avatar" style="display: flex;justify-content:space-between;padding-left:20px" ><div style="display: flex;width:83%;"><div style="line-height:6;">';
			ulKEli_html = ulKEli_html + i.toString() + '.</div><div style="margin-left:4%"><h5 class="title">' + list_articles[i-1].title + '</h5><p>Date posted:' + list_articles[i-1].date + '</p></div></div><div class="switch" style="line-height:6;"><label><input type="checkbox" id="mycheckbox"><span class="lever"></span>On<!-- <a onclick="value_()">value</a> --></label></div></li>';
		}
		// console.log(ulKEli_html);
		ul_tag.innerHTML = ulKEli_html;
		if(total_count==0){
			raiseZeroResultsToast();
				}
		else{
			document.body.appendChild(table);
			removeJoinButtons();
			buttons = document.createElement('div');
			buttons.style.textAlign = "center";
			buttons.id = "join-buttons";
			buttons.style.display = "flex";
			buttons.style.justifyContent = "space-around";
			buttons.style.marginTop = "3%";
			buttons.style.marginBottom = "9%";
			buttons.innerHTML = '<div><button id="btn-all" class="waves-effect waves-light btn-large">Join All Articles</button></div><div><button id="btn-some" class="waves-effect waves-light btn-large">Join Only Selected Articles</button></div>';
			document.body.appendChild(buttons);
		}
	}
	function getTable(e){
		console.log("yogesh");
		file_name = document.getElementById('pdfname');
		file_name.innerHTML = "GeeksHack";
		var choice1 = document.getElementById('company-name');
		var companyValue = choice1.options[choice1.selectedIndex].value;
		companyName = choice1.options[choice1.selectedIndex].text;
		var choice2 = document.getElementById('category');
		categoryValue = choice2.options[choice2.selectedIndex].value;
		if(companyValue=="0" || categoryValue=="0"){
			raiseInvalidSearch();
		}
		else{
			removeContentDiv();
			removeTable();
			removeContentHeading();
			removeJoinButtons();
			removePrintButton();
			createLoader();
			categoryName = choice2.options[choice2.selectedIndex].text;
			$.ajax({
				url : window.location.origin + '/list/',
				method : 'GET',
				data : {
					'company' : companyName,
					'category' : categoryName,
				},
				datatype : 'json',
				success : function(response){
					list_articles = response.list_articles;
					total_count = response.total_count;
					// console.log(list_articles)
					// console.log(total_count)
					removeLoader();
					createTable();
				}
			})
		}
	}

	function createContentDiv(final_content){
		removeContentDiv();
		removePrintButton();
		removeContentHeading();
		removeTable();
		removeJoinButtons();
		
		print_button = document.createElement('div')
		print_button.id = "print-btn";
		print_button.style.position = "fixed";
		print_button.style.right = "6%";
		print_button.style.top = "0%";
		print_button.style.zIndex = "6";
		print_button.innerHTML = '<button id="print_button" class="waves-effect waves-light btn-large">Save as PDF Or Print</button>'
		document.body.appendChild(print_button);

		heading = document.createElement('div');
		heading.id = "content-heading";
		heading.style.marginTop = "8%";
		heading.innerHTML = '<h2>' + companyName + "-" + categoryName + ' Articles</h2>';

		document.body.appendChild(heading);

		content_div = document.createElement('div');
		content_div.id = "content-articles";
		content_div.style.marginTop = "4%";
		content_div.style.marginBottom = "9%";
		content_div.style.width = "90%";
		content_div.innerHTML = final_content;
		/*
		var el=document.getElementsByClassName('entry-title')[0];
		var el1=document.createElement('h4');
		el1.innerHTML=el.innerHTML;
		el.parentNode.appendChild(el1);
		el.parentNode.removeChild(el);
		*/
		// console.log("---------------------------")
		// console.log(content_div.innerHTML)
		content_div.innerHTML = content_div.innerHTML + '<p><b>This collection was compiled by <a href="http://geekshack.herokuapp.com/">GeeksHack</a>, powered by <a href="http://www.geeksforgeeks.org/">GeeksForGeeks</a>.</b><p>'
		document.body.appendChild(content_div);
		//Materialize.toast('Press Ctrl+P to Save(as PDF) or Print. Thanks :)',5000, 'rounded');
	}

	function combineAll(e){
		removeContentDiv();
		removePrintButton();
		removeContentHeading();
		removeTable();
		removeJoinButtons();

		createLoader();
		var total_responses = 0;
		var articles_url_list = [];
		console.log("HI")
		for(var i=0;i<list_articles.length;i++){

			articles_url_list.push(list_articles[i].link);
		}
		console.log("HI2")
		console.log(articles_url_list)
		max_count = articles_url_list.length;
		if(max_count>80){
			raiseResultsTakingTimeToast();
		}
		var final_content = "";
		var start = 0;
		var end = 40;
		var temp_list = []
		while(end<max_count){
			temp_list = [];
			while(start<=end){
				temp_list.push(articles_url_list[start]);
				start++;
			}
			$.ajax({
				url : window.location.origin + "/combine/",
				method : 'GET',
				traditional : true, //to send a list through AJAX
				data : {
					'link_articles' : temp_list,
				},
				datatype : 'json',
				success : function(response){
					var articles_content = response.content;
					total_responses += response.count;
					final_content += articles_content.toString();
					if(total_responses==max_count){
						removeLoader();
						createContentDiv(final_content);
					}
				}
			})
			end+=40;
		}
		if(start<max_count){
			temp_list = []
			while(start<max_count){
				temp_list.push(articles_url_list[start])
				start++;
			}
			$.ajax({
				url : window.location.origin + "/combine/",
				method : 'GET',
				traditional : true, //to send a list through AJAX
				data : {
					'link_articles' : temp_list,
				},
				datatype : 'json',
				success : function(response){
					var articles_content = response.content;
					final_content += articles_content.toString();
					total_responses += response.count;
					// console.log("Hi3")
					// console.log(final_content)
					// console.log(total_responses)
					if(total_responses==max_count){
						removeLoader();
						createContentDiv(final_content);
					}
				}
			})
		}
	}
	
	function combineSome(e){
		console.log("join some")
		var input = $("input[id='mycheckbox']");
		var articles_url_list = [];
		for(var i=0;i<input.length;i++){
			bool_check = input[i].checked;
			if(bool_check){
				articles_url_list.push(list_articles[i].link);
			} 
		}

		if(articles_url_list.length==0){
			raiseSelectOneArticle();
		}
		else{
			removeContentDiv();
			removePrintButton();
			removeContentHeading();
			removeTable();
			removeJoinButtons();
			createLoader();
			$.ajax({
				url : window.location.origin + "/combine/",
				method : 'GET',
				traditional : true, //to send a list through AJAX
				data : {
					'link_articles' : articles_url_list,
				},
				datatype : 'json',
				success : function(response){
					var articles_content = response.content;
					removeLoader();
					createContentDiv(articles_content);
				}
			})
		}
	}

	function init(){
		console.log("yogesh");
		search_button = document.getElementById('btn-tag');
		//console.log(search_button);
		search_button.addEventListener('click', getTable);

		document.body.addEventListener('click', function(event){
			if (event.target.id == "btn-some"){
				file_name = document.getElementById('pdfname');
				file_name.innerHTML = "GeeksCrawler";
				combineSome();
			}
			if (event.target.id == "btn-all"){
				file_name = document.getElementById('pdfname');
				file_name.innerHTML = "GeeksCrawler";
				combineAll();
			}
			if (event.target.id == "print_button"){
				file_name = document.getElementById('pdfname');
				file_name.innerHTML = companyName + "-" + categoryName + "-Geeks Crawler";
				window.print();
			}
		});
	}
	
	return {
		init: init
	};
})();
