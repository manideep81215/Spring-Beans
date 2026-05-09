package com.hackathon.hcl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HclApplication {

	public static void main(String[] args) {
		SpringApplication.run(HclApplication.class, args);
	}

}
