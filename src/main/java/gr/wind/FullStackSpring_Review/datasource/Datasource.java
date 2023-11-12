package gr.wind.FullStackSpring_Review.datasource;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.TimeZone;

@Configuration
public class Datasource {

    @Value("${app.timezone}")
    private String appTimezone;

    @PostConstruct
    public void init() {
        // Set the application-wide timezone
        TimeZone.setDefault(TimeZone.getTimeZone(appTimezone));
    }

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

    @Bean(name="nova_db")
    @ConfigurationProperties("app.datasourcenova")
    public HikariDataSource hikariDataSource_NOVA_DB() {
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

    @Bean("jdbcTemplateForNovaDB")
    public JdbcTemplate jdbcTemplate_Nova_DB(@Qualifier("nova_db") DataSource ccbsDataSource) {
        return new JdbcTemplate(ccbsDataSource);
    }

}
