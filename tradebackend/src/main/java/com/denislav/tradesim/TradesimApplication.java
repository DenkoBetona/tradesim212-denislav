package com.denislav.tradesim;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TradesimApplication {

	private static final Logger log = LoggerFactory.getLogger(TradesimApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(TradesimApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(){
		return args -> {
			log.info("Trading sim by Denislav Nikolov");
		};
	}

}
