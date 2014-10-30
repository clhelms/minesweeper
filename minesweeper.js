$(document).ready(function () {
	var elapsed = 0;
	var start_date = null;
	// Clicking Submit Button
	$("#submit").on('click', function() {
		// Checks to see in width is valid
		if($("input[name='width']").val() > 30 || $("input[name='width']").val() < 8) {
			alert('Please enter a height between 8 and 30');
		} 
		
		// checks to see if height is valid
		else if($("input[name='height']").val() > 40 || $("input[name='height']").val() < 8) {
			alert('Please enter a width between 8 and 40');
		}

		// checks to see if number of mines is valid
		else if($("input[name='mines']").val() > ($("input[name='width']").val() * $("input[name='height']").val() - 1) || $("input[name='mines']").val() < 1) {
			alert('Please enter a mine value less than the size of the board');
		}		

		// builds the board
		else {
			// Changes "Submit" button to "Restart" button
			$("button").text("Restart");
			
			build_board($("#information input[name='width']").val(),$("#information input[name='height']").val());
			place_mines($("#information input[name='width']").val(),$("#information input[name='height']").val(), $("#information input[name='mines']").val())
			// reset values
			space_count = $("#information input[name='width']").val() * $("#information input[name='height']").val();
			flag_count = 0;
			losing = false;
			}
	});
	
	
	// Clicking Minesweeper Cell
	$(document).on('mousedown', 'td', function(e) {
		// Right-Click
		if(e.which == 3 && losing == false) {
			// If the cell has not been revealed, then a flag may be triggered
			if($(this).attr('flag') != 'revealed' && $(this).attr('flag') != 'revealedNum') {
				// If a flag is not already there, then a flag will be placed
				if($(this).attr('clicked') == 'no') {
					$(this).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/flag.png)");
					$(this).attr('clicked', 'yes');
					
					// Number of mines left decrements
					flag_count = flag_count + 1;
					$("#mine_count").text("Mines Left: " + ($("#information input[name='mines']").val() - flag_count));
				}	
				// If a flag is already there, then a flag will be removed
				else if($(this).attr('clicked') == 'yes') {
					$(this).css("background-image", "none");
					$(this).attr('clicked', 'no');
					
					// Number of mines left increments
					flag_count = flag_count - 1;
					$("#mine_count").text("Mines Left: " + ($("#information input[name='mines']").val() - flag_count));
				}	
			}
		}
		// Left Click - If you click a mine that is not flagged, you lose
		else if (e.which == 1 && $(this).attr('flag') == 'mine' && $(this).attr('clicked') == 'no' && losing == false){
			$(this).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/mine.png)");
			alert("You lose");

			// Flag so that no other cells may be clicked
			losing = true;
			
			// Reveal all of the mines
			for(i = 0; i < $("#information input[name='width']").val(); i++) {
				for(j = 0; j < $("#information input[name='height']").val(); j++) {
					var cell = document.getElementById(i + " " + j);
					if($(cell).attr('flag') == 'mine') {
						$(cell).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/mine.png)");
					}
				}
			}
		}
		// Left Click - If you click a space next to a mine, the space will reveal the number of mines to which it is adjacent
		else if (e.which == 1 && $(this).attr('flag') == 'nextToMine' && $(this).attr('clicked') == 'no' && losing == false){
			// Sets the correct number image
			toNumber(this);
			$(this).attr('shown', 'yes');

			// If the space has not yet been subtracted from the overall space count, do so
			if($(this).attr("num") == 'no') {
				$(this).attr("num", "yes");
				space_count = space_count - 1;
			}
		} 
		// Left Click - If a space has a number and all of its adjacent mines have been flaged, then it will reveal all other adjacent numbers
		else if (e.which == 1 && $(this).attr('flag') == 'revealedNum' && $(this).attr('clicked') == 'no' && losing == false) {
			check_num($("#information input[name='width']").val(),$("#information input[name='height']").val(),this);
			$(this).attr('shown', 'yes');
		}
		// Left Click - If a space is free and is not flaged, then it will reveal all connected free spaces
		else if(e.which == 1 && $(this).attr('flag') == 'free' && $(this).attr('clicked') == 'no' && losing == false) {
			check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),this);
			$(this).attr('shown','yes');
		} 
		
		var counting = 0;
		for(i = 0; i < $("#information input[name='width']").val(); i++) {
			for(j = 0; j < $("#information input[name='height']").val(); j++) {
				var newcell = document.getElementById(i + " " + j);
				if($(newcell).attr('shown') == 'no') {
					counting = counting + 1;
				}
			}
		}
		// If the only spaces left unclicked are mines, then the game is won
		if(counting == $("#information input[name='mines']").val() && losing == false) {
			//alert("You win!");
		
		// If all of the mines have been flaged, then the game is won
			if(flag_count == $("#information input[name='mines']").val()) {
				var flags = true;
			
				for(i = 0; i < $("#information input[name='width']").val(); i++) {
					for(j = 0; j < $("#information input[name='height']").val(); j++) {
						var cell = document.getElementById(i + " " + j);
						if($(cell).attr('flag') != 'mine' && $(cell).attr('clicked') == 'yes') {
							flags = false;
						}
					}
				}
			
				if(flags == true) {
					alert("You win!");
					losing = true;
				}
			}
		}
		
	});
	
});
var space_count = 0;
var flag_count = 0;
var losing = false;

// builds the board
var build_board = function(a, b) {
	// clears game_board 
	$("#game_board").empty();

	var board_list = document.getElementById("game_board");
	
	var table = document.createElement('TABLE');
	table.border = '.25';
	table.align = 'center';
	
	for(var i = 0; i < a; i++) {
		var tr = document.createElement('TR');
		table.appendChild(tr);
		
		for(var j = 0; j < b; j++) {
			var td = document.createElement('TD');
			
			// Cell id is "row column"
			td.id = i + " " + j;
			// Right Click Flag 
			$(td).attr('clicked', 'no');
			// Cell Content
			$(td).attr('flag', 'free');
			// Count of Adjacent Mines
			$(td).attr('count', 0);
			// Row
			$(td).attr('row', i);
			// Column
			$(td).attr('column', j);
			// Added to Space Count
			$(td).attr('num', 'no');
			$(td).attr('shown', 'no');
			
			tr.appendChild(td);
			
			// Sets cell's width and height
			td.style.width = '30px';
			td.style.height = '30px';
		}
	}	
	board_list.appendChild(table);
	$("#mine_count").text("Mines Left: " + $("#information input[name='mines']").val());
}

// Randomly Places Mines on Board
var place_mines = function(a, b, c) {
	for(i = 0; i < c; i++){
		var loop = 0;

		// Places mines randomly
		while(loop == 0) {
			var row = Math.floor(Math.random()*a);
			var column = Math.floor(Math.random()*b);
			var cell = document.getElementById(row + " " + column);
			// If space is not already a mine, exit loop
			if($(cell).attr('flag') != 'mine') {
				loop = 1;
			}
		}
		
		// Checking Up
		if(row > 0) {
			var other = document.getElementById((row - 1) + " " + column);
			
			// If the cell is not a mine, mark it as next to a mine
			if($(other).attr('flag') != 'mine') {
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}

		}
		
		// Checking Upper Right
		if(column < b && row > 0) {
			var other = document.getElementById((row - 1) + " " + (column + 1));
			if($(other).attr('flag') != 'mine') {
			// If the cell is not a mine, mark it as next to a mine
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}

		// Checking Right
		if(row < a) {
			var other = document.getElementById(row + " " + (column + 1));
			if($(other).attr('flag') != 'mine') {
			// If the cell is not a mine, mark it as next to a mine			
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		
		// Checking Bottom Right
		if(row < a && column < b) {
			var other = document.getElementById((row + 1) + " " + (column + 1));
			if($(other).attr('flag') != 'mine') {
			// If the cell is not a mine, mark it as next to a mine
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		
		// Checking Bottom
		if(column < b) {
			var other = document.getElementById((row + 1) + " " + column);
			// If the cell is not a mine, mark it as next to a mine
			if($(other).attr('flag') != 'mine') {
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		
		// Checking Bottom Left
		if(row < a && column > 0) {
			var other = document.getElementById((row + 1) + " " + (column - 1));
			// If the cell is not a mine, mark it as next to a mine
			if($(other).attr('flag') != 'mine') {
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		
		// Checking Left
		if(column > 0) {
			var other = document.getElementById(row + " " + (column - 1));
			// If the cell is not a mine, mark it as next to a mine
			if($(other).attr('flag') != 'mine') {
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		
		// Checking Upper Left
		if(row > 0 && column > 0) {
			var other = document.getElementById((row - 1) + " " + (column - 1));
			// If the cell is not a mine, mark it as next to a mine
			if($(other).attr('flag') != 'mine') {
				$(other).attr('flag', 'nextToMine');
				var num = Number($(other).attr('count')) + 1;
				$(other).attr('count', num);
			}
		}
		// Label cell as a mine
		$(cell).attr('flag', 'mine');
	}
}

// Check to see if adjacent spaces are free and, if so, reveals them
var check_free = function(a,b,c) {
		var row = Number($(c).attr("row"));
		var column = Number($(c).attr("column"));
		
		if($(c).attr('flag') != 'revealedNum') {
			$(c).attr('flag', 'revealed');
			$(c).css("background-color", "#99CCCC");
			$(c).attr('shown', 'yes');
		}
		space_count = space_count - 1;
		
		// Checking Up
		if(row > 0) {
			var other = document.getElementById((row - 1) + " " + column);
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
				$(other).css('shown', 'yes');
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('flag', 'revealedNum');
					$(other).attr('shown', 'yes');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Upper Right
		if(column < b && row > 0) {
			var other = document.getElementById((row - 1) + " " + (column + 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
				$(other).css('shown', 'yes');
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}

		// Checking Right
		if(row < a) {
			var other = document.getElementById(row + " " + (column + 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).css('shown', 'yes');
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Bottom Right
		if(row < a && column < b) {
			var other = document.getElementById((row + 1) + " " + (column + 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).css('shown', 'yes');
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Bottom
		if(column < b) {
			var other = document.getElementById((row + 1) + " " + column);
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).css('shown', 'yes');
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Bottom Left
		if(row < a && column > 0) {
			var other = document.getElementById((row + 1) + " " + (column - 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).css('shown', 'yes');
				$(other).attr('flag', 'revealed');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Left
		if(column > 0) {
			var other = document.getElementById(row + " " + (column - 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).attr('flag', 'revealed');
				$(other).css('shown', 'yes');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}
		
		// Checking Upper Left
		if(row > 0 && column > 0) {
			var other = document.getElementById((row - 1) + " " + (column - 1));
			if($(other).attr('flag') == 'free' && $(other).attr('clicked') == 'no') {
				check_free(a, b, other);
				$(other).attr('flag', 'revealed');
				$(other).css('shown', 'yes');
				$(other).css("background-color", "#99CCCC");
			} else if($(other).attr('flag') == 'nextToMine' && $(other).attr('clicked') == 'no') {
				toNumber(other);
				if($(other).attr('num') == 'no') {
					$(other).attr('num', 'yes');
					$(other).attr('shown', 'yes');
					$(other).attr('flag', 'revealedNum');
					space_count = space_count - 1;
				}
			}
		}

}

var check_num = function(a,b,c) {
		var row = Number($(c).attr("row"));
		var column = Number($(c).attr("column"));
		var count = 0;
		
	for(i = 0; i < 2; i++) {
		// Checking Up
		if(row > 0) {
			var other = document.getElementById((row - 1) + " " + column);
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Upper Right
		if(column < b && row > 0) {
			var other = document.getElementById((row - 1) + " " + (column + 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('shown', 'yes');
						$(other).attr('num', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}

		// Checking Right
		if(row < a) {
			var other = document.getElementById(row + " " + (column + 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Bottom Right
		if(row < a && column < b) {
			var other = document.getElementById((row + 1) + " " + (column + 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Bottom
		if(column < b) {
			var other = document.getElementById((row + 1) + " " + column);
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Bottom Left
		if(row < a && column > 0) {
			var other = document.getElementById((row + 1) + " " + (column - 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('shown', 'yes');
						$(other).attr('num', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Left
		if(column > 0) {
			var other = document.getElementById(row + " " + (column - 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}
		}
		
		// Checking Upper Left
		if(row > 0 && column > 0) {
			var other = document.getElementById((row - 1) + " " + (column - 1));
			if($(other).attr('clicked') == 'yes' && i == 0) {
				count = count + 1;
			} else if($(other).attr('clicked') == 'no' && i == 1 && Number($(c).attr('count')) == count) {
				if($(other).attr('flag') == 'nextToMine') {
					toNumber(other);
					if($(other).attr('num') == 'no') {
						$(other).attr('num', 'yes');
						$(other).attr('shown', 'yes');
						$(other).attr('flag', 'revealedNum');
						space_count = space_count - 1;
					}
				} else if ($(other).attr('flag') == 'mine') {
					lost(other);
				} else if($(other).attr('flag') == 'free') {
					check_free($("#information input[name='width']").val(),$("#information input[name='height']").val(),c);
				}
			}	
		}
	}
}

var toNumber = function(a) {
			if($(a).attr('count') == '1') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/one.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '2') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/two.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '3') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/three.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '4') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/four.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '5') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/five.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '6') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/six.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '7') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/seven.png)");
				$(a).attr('flag', 'revealedNum');
			} else if ($(a).attr('count') == '8') {
				$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/eight.png)");
				$(a).attr('flag', 'revealedNum');
			}
}

var lost = function(a) {
			$(a).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/mine.png)");
			alert("You lose");

			// Flag so that no other cells may be clicked
			losing = true;
			
			// Reveal all of the mines
			for(i = 0; i < $("#information input[name='width']").val(); i++) {
				for(j = 0; j < $("#information input[name='height']").val(); j++) {
					var cell = document.getElementById(i + " " + j);
					if($(cell).attr('flag') == 'mine') {
						$(cell).css("background-image", "url(http://www.cs.unc.edu/Courses/comp426-f14/clhelms/a2/mine.png)");
					}
				}
			}
}
