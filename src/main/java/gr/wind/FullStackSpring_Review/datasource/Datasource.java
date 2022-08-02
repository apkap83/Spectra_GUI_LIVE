package gr.wind.FullStackSpring_Review.datasource;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class Datasource {

    @Bean(name="spectraLiveDB")
    @ConfigurationProperties("app.datasource")
    public HikariDataSource hikariDataSource_SpectraLive() {
        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();

    }

    @Bean(name="spectraReportingDB")
    @ConfigurationProperties("app.datasource2")
    public HikariDataSource hikariDataSource__SpectraReporting() {
        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();

    }

    @Bean(name="cdr_db")
    @ConfigurationProperties("app.datasourceoracle")
    public HikariDataSource hikariDataSource_CDR_DB() {
        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();

    }

    @Bean("jdbcTemplateForLiveDB")
    public JdbcTemplate jdbcTemplate_live(@Qualifier("spectraLiveDB") DataSource ccbsDataSource) {
        return new JdbcTemplate(ccbsDataSource);
    }

    @Bean("jdbcTemplateForReportingDB")
    public JdbcTemplate jdbcTemplate_reporting(@Qualifier("spectraReportingDB") DataSource ccbsDataSource) {
        return new JdbcTemplate(ccbsDataSource);
    }

    @Bean("jdbcTemplateForCDRDB")
    public JdbcTemplate jdbcTemplate_CDR_DB(@Qualifier("cdr_db") DataSource ccbsDataSource) {
        return new JdbcTemplate(ccbsDataSource);
    }

}
