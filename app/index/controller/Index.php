<?php
namespace app\index\controller;
use think\Controller;
use think\Db;

class Index
{

	private function compare_json($json1,$json2){
		if($json2!=$json1)
		{
			return false;
		}
		return true;		
	}
	
	private function save($folder)
	{			
		try
		{
			$task = input('param.task/d', 0);
			$suffix = input('param.suffix/s', "");
			$size = input('param.size/d', 0);
			$verify_md5= input('param.md5/s', 0);
			$review=input('param.review/d', 0);
			$md5_cal="";
			if ($folder === 1||$folder === 2) {
				$json = input('param.json/s', "");
				$json_size=strlen($json);
				$md5_cal=md5($json);
				
				if($md5_cal!=$verify_md5)
				{
					echo 0;
					return;
				}
				if($review!=-1){
					$filename = "results1/" . $task . ".json";
					if (!file_exists($filename) ) {
						echo 0;
						return;
					}
					$file = fopen($filename, "r");
					$contents = fread($file, filesize($filename));
					fclose($file);

					if(!$this->compare_json(json_decode($contents),json_decode($json)))
					{
						$file = fopen('backup3' . '/'. $task . '_' . $suffix . '.json', "w");
						fwrite($file, $json);
						fclose($file);
						$file = fopen('results3' . '/'. $task . '.json', "w");
						fwrite($file, $json);
						fclose($file);
					}

					$file = fopen('backup2' . '/'. $task . '_' . $suffix . '.json', "w");
					fwrite($file, $json);
					fclose($file);
					$file = fopen('results2' . '/'. $task . '.json', "w");
					fwrite($file, $json);
					fclose($file);
				}
				else
				{
					$file = fopen('backup' . $folder . '/'. $task . '_' . $suffix . '.json', "w");
					fwrite($file, $json);
					fclose($file);
					$file = fopen('results' . $folder . '/'. $task . '.json', "w");
					fwrite($file, $json);
					fclose($file);
				}			
			}
			echo $md5_cal;			
			// echo 1;	
		} catch (\Exception $e) {
			echo $e;
		}
	}

	private function show() {
		try {
			$task = input('param.task/d', 0);
			$backup = input('param.backup/d', 0);
			
			$filename = "results1/" . $task . ".json";
			if ($backup === 1) {
				$task = input('param.task/s', '');
				$filename = "backup1/" . $task . ".json";
			}
			
			if ( !file_exists($filename) ) {
				echo $filename;
				return;
			}
			$file = fopen($filename, "r");
			$contents = fread($file, filesize($filename));
			fclose($file);
			
		} catch (\Exception $e) {
			echo 0;
		}
		return view('show', [
			'task' => $task, 
			'contents' => $contents,
		 ]);
		 
	}

	private function load_json() {
		try {
			$task = input('param.task/d', 0);
			$backup = input('param.backup/d', 0);
			$review = input('param.review/d', 0);
			//如果不是审核模式，从result1读取。
			if($review>0){
				$filename = "results2/" . $task . ".json";
				if ( !file_exists($filename) ) {
					$filename = "results1/" . $task . ".json";
					if ( !file_exists($filename) ) {
						echo 0;
						return;
					}
				}
			}
			else{
				$filename = "results1/" . $task . ".json";
				if ( !file_exists($filename) ) {
					echo 0;
					return;
				}
			}
			
			$file = fopen($filename, "r");
			$contents = fread($file, filesize($filename));
			fclose($file);
			echo $contents;
		} catch (\Exception $e) {
			echo 0;
		}	 
	}
	
	private function admin($passwd) {
		if ($passwd != config("app_password")
			&& $passwd != "check") {
			echo "Invalid user.";
			return; 
		} 
		$start = input('param.start/d', 1);
		if ($start < 1) $start = 1;
        
		$file = fopen("public/images/background_box.txt", "r") or die("Unable to open file!");
		$N = (int)fgets($file);
		fclose($file);
        
		$end = input('param.end/d', $N);
		if ($end > $N) $end = $N; 
		
		$list = array(); 
		$check_list = array(); 
		$admin_list = array();
		$admin_list_change = array();
		$sketch_exist = 0; 
		$label_done = 0;
		$review_done=0;
		for ($i = $start; $i <= $end; ++$i) {
			$filename = "public/images/stroke/" . $i . ".json";
			if ( file_exists($filename) ) {
				array_push($list, $i); 
				++$sketch_exist;
			}
			$filename1 = "results1/" . $i . ".json";
			if ( file_exists($filename1) ) {
				array_push($check_list, $i); 
				++$label_done;
			}
			$filename2 = "results2/" . $i . ".json";
			if ( file_exists($filename2) ) {
				array_push($admin_list, $i); 
				++$review_done;
			}
			$filename3 = "results3/" . $i . ".json";
			if ( file_exists($filename3) ) {
				array_push($admin_list_change, $i); 
			}
		}
		if ($passwd == "check") 
		{
			return view("check", [
				'admin' => 'Check',
				'total' => $N,
				'sketch_exist' => $sketch_exist,
				'percentage' => $label_done / $N * 100,
				'label_done' => $label_done,
				'list' => json_encode($list),
				'check_list' => json_encode($check_list),
				'passwd' => $passwd,
			]);
		}
		return view("admin", [
			'admin' => 'Admin',
			'total' => $N,
			'sketch_exist' => $sketch_exist,
			'percentage' => $label_done / $N * 100,
			'label_done' => $label_done,
			'percentage_admin' => $review_done / $N * 100,
			'review_done' => $review_done,
			'list' => json_encode($list),
			'check_list' => json_encode($check_list),
			'admin_list' => json_encode($admin_list),
			'admin_list_change' => json_encode($admin_list_change),
			'passwd' => $passwd,
		]);
	}
	
	private function history() {
		$task = input('param.history/d', 0);
		$ans = glob("backup1/" . $task ."_*.json"); 
		if (empty($ans)) return;
		usort($ans, create_function('$a,$b', 'return filemtime($b) - filemtime($a);'));
		
		foreach ($ans as &$filename) {
			$filename = substr(substr($filename, 8), 0, -5);
		}
		echo json_encode($ans); 
	}
	
    public function index()
    {
		$task = input('param.task/d', 1);
		if ($task <= 0) $task = 0; 
		
		$load = input('param.load/d', -1);
		if ($load !== -1) {
			return $this->load_json();
		}
		
        $history = input('param.history/d', -1);
		if ($history !== -1) {
			return $this->history();
		}
		
        $save = input('param.save/d', -1);
		if ($save !== -1) {
			return $this->save($save);
		}

        $user = input('param.user/s', null);
		if ($user != null) {
			return $this->admin($user); 
		}
		// read the txt 
		$file = fopen("public/images/background_box.txt", "r") or die("Unable to open file!");
		

		$total = 0; 
		$M = (int)fgets($file);
		for ($j = 0; $j < $M; ++$j) {
			$line = explode(';',fgets($file));
			$name= $line[0];
			$boxs=$line[1];
			$categories=$line[1];
			++$total;
			if ($total >= $task) break; 
		}
	
		fclose($file);
		
		$filename = "public/images/stroke/" . $task . ".json";
		$stroke="[]";
		if ( file_exists($filename) ) {
			$file = fopen($filename, "r");
			$stroke = fread($file, filesize($filename));
			fclose($file);
		}

		$review = input('param.review/d', -1);
	
		$params=[
			'task' => $task, 
			'scene' => 'bicycle', 
			'reference' => trim($name),
			'review' => trim($review),
			'boxs' => trim($boxs),
			'stroke' => $stroke,
			'ver' => '19',
		];

		return view('index', $params);
	}
	
}
